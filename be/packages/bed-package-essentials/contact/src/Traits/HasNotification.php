<?php

namespace JamstackVietnam\Contact\Traits;

use Illuminate\Support\Facades\Notification;
use JamstackVietnam\Contact\Notifications\CommonNotification;
use JamstackVietnam\Contact\Models\Contact;

trait HasNotification
{
    public static function bootHasNotification()
    {
        static::created(function ($model) {
            if (request()->route() === null || !config('contact.send_email_default', true)) return;

            try {
                if ($model->status === Contact::STATUS_IS_SPAM) {
                    $emails = [config('contact.mail_spam', 'khapcn.flamedia@gmail.com')];

                    $data['mail_title'] = config('contact.message.new_spam', 'Thông báo nhận được Spam');

                    $data = array_merge($data, $model->data);

                    $route = config('contact.types.' . $model->type . '.route');

                    $data['url'] = route(current_locale() . '.admin.' . $route . '.form', [ 'id' => $model->id ]);

                    foreach($emails as $email)
                    {
                        Notification::route('mail', $email)
                            ->notify(new CommonNotification($data));
                    }
                }
                else {
                    $emails = array_filter(explode(',', notification_to()));
                    if (empty($emails)) {
                        $emails = [config('contact.mail_spam') ?: 'admin@dongnaiford.com.vn'];
                    }

                    $salesEmail = null;
                    if (!empty($model->data['sales_email']) && filter_var($model->data['sales_email'], FILTER_VALIDATE_EMAIL)) {
                        $salesEmail = trim($model->data['sales_email']);
                    } elseif (!empty($model->data['landing_page_id'])) {
                        $ldp = \App\Models\Vehicle\LandingPage::find($model->data['landing_page_id']);
                        if ($ldp && !empty($ldp->sales_email) && filter_var($ldp->sales_email, FILTER_VALIDATE_EMAIL)) {
                            $salesEmail = trim($ldp->sales_email);
                        }
                    } elseif (!empty($model->sales_consultant_id)) {
                        $ldp = \App\Models\Vehicle\LandingPage::where('sales_consultant_id', $model->sales_consultant_id)
                            ->whereNotNull('sales_email')
                            ->first();
                        if ($ldp && !empty($ldp->sales_email) && filter_var($ldp->sales_email, FILTER_VALIDATE_EMAIL)) {
                            $salesEmail = trim($ldp->sales_email);
                        } elseif ($model->salesConsultant && !empty($model->salesConsultant->email) && filter_var($model->salesConsultant->email, FILTER_VALIDATE_EMAIL)) {
                            $salesEmail = trim($model->salesConsultant->email);
                        }
                    }

                    if ($salesEmail) {
                        $emails = [$salesEmail];
                    }

                    $data['mail_title'] = config('contact.message.new_contact');

                    if (method_exists($model, 'transformEmail')) {
                        $data = array_merge($data, $model->transformEmail());
                    }

                    foreach($emails as $email)
                    {
                        Notification::route('mail', $email)
                            ->notify(new CommonNotification($data));
                    }
                }

                // send customer
                if (method_exists($model, 'transformEmailDetails')) {
                    $data = $model->transformEmailDetails();
                } else {
                    $data = $model->data;
                }

                $data['mail_title'] = config('contact.message.success_form');
                if (isset($data['Email'])) {
                    $emailTo = $data['Email'];

                    Notification::route('mail', $emailTo)
                        ->notify(new CommonNotification($data));
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('SMTP Mail sending failed: ' . $e->getMessage());
            }
        });
    }
}
