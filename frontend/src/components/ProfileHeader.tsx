import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/Sounds/mouse-click.mp3");

const ProfileHeader = () => {
  const { authUser, logout, updateProfile, isProfileLoading } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState<null | string>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (e: any) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = reader.result;
        if (typeof base64Image === "string") {
          await updateProfile({ profilePic: base64Image });
          setSelectedImg(base64Image);
        }
      };
    } catch (error) {
      console.log("Error while uploading:", error);
    }
  };
  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current?.click();
              }}
            >
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="User Image"
                className="size-full object-cover"
              />
              {isProfileLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="loading loading-ring loading-lg text-secondary"></span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Edit</span>
                </div>
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Username and Status */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser?.fullName}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          {/* Logout */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* Sound */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound
                .play()
                .catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
