import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from '@chakra-ui/react'

const Navbar = () => {
    return (
        <Breadcrumb>
            <BreadcrumbItem>
                <BreadcrumbLink href='/company'>Company</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink href='../'>Vehicle</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
    );
};

export default Navbar;
