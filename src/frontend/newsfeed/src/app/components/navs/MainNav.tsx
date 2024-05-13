"use client";
import { logout, whoIsMe } from "@/app/API/route/auth";
import { appUser, clearUser, setUser } from "@/lib/redux/features/app/appSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Logout as LogoutIcon,
  Newspaper as NewspaperIcon,
  Subscriptions as SubscriptionsIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Divider,
  Icon,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MainNav = () => {

  const [email, setEmail] = useState<string | null>('');
  const router = useRouter();
  const user = useAppSelector(appUser)

  const disptach = useAppDispatch()

  const navItems = [
    {
      title: "Subscribe",
      icon: SubscriptionsIcon,
      href: "/dashboard/subscription",
    },
    {
      title: "News",
      icon: NewspaperIcon,
      href: "/dashboard/news",
    },
  ];

  useEffect(() => {
    const getUser = async () => {
      const response = await whoIsMe();
      const userData = response ? response.data : null;

      if (userData) {
        setEmail(userData.email);
      } else {
        setEmail(null);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    if(email) {
      const response = await logout({email});
      if (response) {
        setEmail('');
        disptach(clearUser())
        router.push("/auth");
      }
    }
  };

  useEffect(() => {
    console.log({user})
    setEmail(user)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <AppBar className="tw-bg-cyan-800">
      <Toolbar>
        <Stack
          className="tw-w-full"
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack direction={`row`} gap={2}>
            {navItems.map((item, index) => {
              return (
                <Stack
                  className="tw-rounded-tr-md tw-rounded-br-md hover:tw-bg-cyan-900 tw-transition-all tw-duration-200 tw-ease-in"
                  direction={"row"}
                  key={`main-nav-item-${index}`}
                  justifyContent={"space-between"}
                >
                  <Divider
                    orientation="vertical"
                    className="tw-border-cyan-900 tw-border-x-2 "
                  />
                  <Link
                    className={`tw-text-slate-100 tw-no-underline tw-p-3 `}
                    href={item.href}
                  >
                    <Stack
                      className="tw-min-w-[42px]"
                      direction={`row`}
                      gap={2}
                    >
                      <Icon className=" tw-text-slate-200 tw-w-6 tw-h-6">
                        <item.icon />
                      </Icon>
                      <Typography variant="button" component={"h2"}>
                        {item.title}
                      </Typography>
                    </Stack>
                  </Link>
                  {/* {index !== navItems.length-1 && <Divider className="tw-px-2 tw-border-slate-400" orientation="vertical" flexItem/>} */}
                </Stack>
              );
            })}
          </Stack>
          {email &&
            <Tooltip title={
              <Typography className="tw-text-teal-100" variant="caption">Logout</Typography>
            }>
              <IconButton color="error" onClick={handleLogout}>
                <LogoutIcon className="tw-text-teal-100" />
              </IconButton>
            </Tooltip>
          }
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default MainNav;
