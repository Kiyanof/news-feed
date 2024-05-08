import {
  Newspaper as NewspaperIcon,
  Subscriptions as SubscriptionsIcon,
} from "@mui/icons-material";
import { AppBar, Box, Divider, Icon, Stack, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

const MainNav = () => {
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

  return (
    <AppBar className="tw-bg-cyan-800">
      <Toolbar>
        <Stack direction={`row`} gap={2}>
          {navItems.map((item, index) => {
            return (
              <Stack className="tw-rounded-tr-md tw-rounded-br-md hover:tw-bg-cyan-900 tw-transition-all tw-duration-200 tw-ease-in" direction={'row'} key={`main-nav-item-${index}`} justifyContent={'space-between'}>
                <Divider orientation="vertical" className="tw-border-cyan-900 tw-border-x-2 "/>
                <Link
                  className={`tw-text-slate-100 tw-no-underline tw-p-3 `}
                  href={item.href}
                >
                  <Stack className="tw-min-w-[42px]" direction={`row`} gap={2}>
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
      </Toolbar>
    </AppBar>
  );
};

export default MainNav;
