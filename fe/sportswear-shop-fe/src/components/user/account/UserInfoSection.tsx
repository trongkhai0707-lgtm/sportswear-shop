import { useEffect, useState } from "react";
import { fetchUserProfile, type UserProfile } from "../../../services/UserService";

export default function UserInfoSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch {
        setError("Không thể tải thông tin cá nhân.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  if (loading) {
    return (
      <div className="rounded border border-gray-200 bg-white p-6 text-center text-gray-600">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded border border-gray-200 bg-white p-6 text-center text-gray-600">
        Không có thông tin
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="mb-6 text-xl font-semibold">Thông tin cá nhân</h3>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-600">Họ và tên</label>
          <div className="mt-2 text-lg">{profile.fullName}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <div className="mt-2 text-lg">{profile.email}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Username</label>
          <div className="mt-2 text-lg">{profile.username}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
          <div className="mt-2 text-lg">{profile.phone || "Chưa cập nhật"}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
          <div className="mt-2 text-lg">{profile.address || "Chưa cập nhật"}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Trạng thái</label>
          <div className="mt-2">
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
              profile.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {profile.active ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
