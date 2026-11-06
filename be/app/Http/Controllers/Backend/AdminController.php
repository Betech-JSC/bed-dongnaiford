<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Traits\HasCrudActions;

class AdminController extends Controller
{
    use HasCrudActions {
        destroy as baseDestroy;
    }

    public $model = Admin::class;

    public $appends = [
        'index' => [],
        'form' => []
    ];

    private function folder()
    {
        return "@Core/" . Str::studly($this->getTable());
    }

    private function beforeStore($request, $rules)
    {
        $id = $request->input('id');

        // Chặn non-Super Admin gán role Super Admin hoặc can thiệp vào tài khoản Super Admin
        if (!current_admin()->hasRole('Super Admin')) {
            $superAdminRole = \Spatie\Permission\Models\Role::where('name', 'Super Admin')->first();
            if ($superAdminRole && (int) $request->input('role_id') === (int) $superAdminRole->id) {
                abort(403, 'Bạn không có quyền gán vai trò Super Admin.');
            }
            if ($id) {
                $targetAdmin = Admin::find($id);
                if ($targetAdmin && $targetAdmin->hasRole('Super Admin')) {
                    abort(403, 'Bạn không có quyền chỉnh sửa tài khoản Super Admin.');
                }
            }
        }

        $rules['email'] = 'required|email|max:255|unique:admins,email,' . ($id ? $id : 'NULL') . ',id,deleted_at,NULL';
        $rules['role_id'] = 'required';

        if ($request->filled('phone')) {
            $rules['phone'] = 'nullable|string|max:20|unique:admins,phone,' . ($id ? $id : 'NULL') . ',id,deleted_at,NULL';
        }

        if (!$id) {
            $rules['password'] = 'required|min:8|max:255|confirmed';
        }

        return $rules;
    }

    private function beforeForm($data)
    {
        $data['sales_consultants'] = \App\Models\Vehicle\SalesConsultant::where('status', 'ACTIVE')
            ->sortByPosition()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email,
                'phone' => $c->phone,
            ]);

        return $data;
    }

    private function afterForm($item)
    {
        if (!current_admin()->hasRole('Super Admin') && $item->hasRole('Super Admin')) {
            abort(403);
        }

        return $item;
    }

    private function beforeIndex($query)
    {
        $query->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END ASC')->orderBy('id', 'ASC');

        if (!current_admin()->hasRole('Super Admin')) {
            $query->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'Super Admin');
            })->where('id', '!=', 1);
        }

        return $query;
    }

    public function destroy($id)
    {
        $ids = explode(',', (string) $id);
        if (in_array((string) current_admin_id(), $ids, true)) {
            return back()->with('error', 'Không thể xóa chính tài khoản đang đăng nhập.');
        }

        if (in_array('1', $ids, true)) {
            return back()->with('error', 'Không thể xóa tài khoản Quản trị viên tối cao (ID 1).');
        }

        foreach ($ids as $adminId) {
            $target = Admin::find($adminId);
            if ($target && $target->hasRole('Super Admin') && !current_admin()->hasRole('Super Admin')) {
                return back()->with('error', 'Bạn không có quyền xóa tài khoản Super Admin.');
            }
        }

        return $this->baseDestroy($id);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|min:8|max:255|confirmed',
        ]);

        $data = [
            'name' => $request->input('name'),
        ];

        if ($password = $request->input('password')) {
            $data['password'] = Hash::make($password);
        }

        auth('admin')->user()->update($data);
    }
}
