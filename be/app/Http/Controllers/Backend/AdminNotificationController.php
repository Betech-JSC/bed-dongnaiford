<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminNotificationController extends Controller
{
    /**
     * Get notification feed for CMS Topbar Bell (JSON API)
     */
    public function getFeed(Request $request)
    {
        $unreadCount = AdminNotification::unread()->count();
        $notifications = AdminNotification::orderBy('created_at', 'desc')->take(15)->get();

        return response()->json([
            'success' => true,
            'unread_count' => $unreadCount,
            'data' => $notifications,
        ]);
    }

    /**
     * Display full Notification Management Page in CMS
     */
    public function index(Request $request)
    {
        $notifications = AdminNotification::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('AdminNotifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => AdminNotification::unread()->count(),
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        if ($id === 'all') {
            AdminNotification::unread()->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        } else {
            $notification = AdminNotification::find($id);
            if ($notification) {
                $notification->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);
            }
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'unread_count' => AdminNotification::unread()->count(),
            ]);
        }

        return redirect()->back()->withSuccess('Đã cập nhật trạng thái thông báo');
    }

    /**
     * Superadmin manually creates & broadcasts system notification
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:info,success,warning,danger',
            'link' => 'nullable|string',
        ]);

        AdminNotification::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'link' => $validated['link'] ?? null,
            'icon' => 'pi-bell',
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'message' => 'Tạo thông báo hệ thống thành công']);
        }

        return redirect()->back()->withSuccess('Tạo thông báo hệ thống thành công');
    }

    /**
     * Delete notification
     */
    public function destroy($id)
    {
        AdminNotification::destroy($id);

        return redirect()->back()->withSuccess('Đã xóa thông báo');
    }
}
