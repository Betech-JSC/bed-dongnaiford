<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Customer;
use App\Traits\HasCrudActions;
use Rap2hpoutre\FastExcel\FastExcel;
use Illuminate\Support\Facades\File;

class CustomerController extends Controller
{
    use HasCrudActions;
    public $model = Customer::class;

    public function export()
    {
        $fileName = implode('_', ['Customer_Export', date('Y-m-d_h.i')]) . '.csv';

        if (!File::isDirectory(storage_path("app/public/export"))) {
            File::makeDirectory(storage_path("app/public/export"), 0777, true, true);
        }

        (new FastExcel($this->customersGenerator()))->export(storage_path("app/public/export/$fileName"));

        return redirect()->to('/storage/export/' . $fileName);
    }

    function customersGenerator()
    {
        foreach (Customer::cursor() as $customer) {
            yield $customer;
        }
    }
}
