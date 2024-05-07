"use client"
import withAuth from "@/app/components/HOC/WithAuth"
import Newspapers from "@/app/components/layout/Newspapers"
import { Container } from "@mui/material"

const PageContent = ({...props}) => {

    return (
        <Container>
            <Newspapers />
        </Container>
    )
}

const Page = withAuth(PageContent)
export default Page