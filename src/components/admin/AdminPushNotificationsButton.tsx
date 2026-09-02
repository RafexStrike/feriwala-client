"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { toast } from "@/hooks/use-toast";
import {
  BrowserPushState,
  disableBrowserPushNotifications,
  enableBrowserPushNotifications,
  getBrowserPushState,
} from "@/lib/push/browserPush";

const getLabel = (state: BrowserPushState) => {
  switch (state) {
    case "enabled":
      return "Notifications on";
    case "denied":
      return "Notifications blocked";
    case "unsupported":
      return "Push unsupported";
    case "default":
    case "disabled":
    default:
      return "Enable notifications";
  }
};

export function AdminPushNotificationsButton() {
  const { isAdmin } = useAuth();
  const [state, setState] = useState<BrowserPushState>("unsupported");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let mounted = true;

    const run = async () => {
      const nextState = await getBrowserPushState();
      if (mounted) {
        setState(nextState);
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  if (!isAdmin || state === "unsupported") {
    return null;
  }

  const handleClick = async () => {
    setIsBusy(true);

    try {
      if (state === "enabled") {
        await disableBrowserPushNotifications();
        setState("disabled");
        toast({ title: "Push notifications disabled" });
        return;
      }

      await enableBrowserPushNotifications();
      setState("enabled");
      toast({ title: "Push notifications enabled" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update push notifications";
      if (message.toLowerCase().includes("denied")) {
        setState("denied");
      }
      toast({
        title: "Push notification setup failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const Icon = state === "enabled" ? BellRing : state === "denied" ? BellOff : Bell;

  return (
    <Button
      type="button"
      variant={state === "enabled" ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isBusy || state === "denied"}
      className="min-w-[172px]"
    >
      {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {getLabel(state)}
    </Button>
  );
}
