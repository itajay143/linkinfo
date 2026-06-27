import ProfilePhoto from "./ProfilePhoto";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useUser } from "@linkinfo/router/user";
import { useConfig } from "@linkinfo/router/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export default function ProfileDropdown() {
  const { t } = useTranslation();
  const { data: user } = useUser();

  const { data: config } = useConfig();

  const isAdmin = user?.id === (config?.ADMIN || 1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="rounded-full p-1">
          <ProfilePhoto
            src={user?.image ? user?.image : undefined}
            priority={true}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem asChild>
          <Link href="/settings/account" className="whitespace-nowrap">
            <i className="bi-gear"></i>
            {t("settings")}
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link
              href="/admin/user-administration"
              onClick={() => (document?.activeElement as HTMLElement)?.blur()}
              className="whitespace-nowrap"
            >
              <i className="bi-hdd-stack"></i>
              {t("server_administration")}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <div onClick={() => signOut()} className="whitespace-nowrap">
            <i className="bi-box-arrow-left" />
            {t("logout")}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
