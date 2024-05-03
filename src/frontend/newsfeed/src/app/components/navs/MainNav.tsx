import { Newspaper as NewspaperIcon, Subscriptions as SubscriptionsIcon } from "@mui/icons-material";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material"
import Link from "next/link";

const MainNav = () => {

    const navItems = [
        {
            title: 'Subscribe',
            icon: SubscriptionsIcon,
            href: '/dashboard/subscription'
        },
        {
            title: 'News',
            icon: NewspaperIcon,
            href: '/dashboard/news'
        }
    ]

    return (
        <AppBar className="tw-bg-cyan-800">
            <Toolbar>
                    <Stack direction={`row`} gap={2}>
                    {
                        navItems.map((item, index) => {
                            return (
                                <Link className={`tw-text-slate-100 tw-no-underline`} href={item.href} key={`main-nav-item-${index}`}>
                                    <Typography variant="h6" component={'h2'}>
                                        {item.title}
                                    </Typography>
                                </Link>
                            )
                        })
                    }
                    </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default MainNav;