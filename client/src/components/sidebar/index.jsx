import React, { useState } from "react";
import Simplebar from 'simplebar-react';
import {Link} from 'react-router-dom';
import classNames from "classnames";
import Menu from './Menu';


import SidebarToggle from "../SidebarToggle";
import { useTheme } from "../../store";
import Icon from "../Icon";

const Sidebar = ({mobile, visibility, setVisibility, compact, setCompact }) => {
    const theme = useTheme();

    const [mouseEnter, setMouseEnter] = useState(false);

    const handleMouseEnter = () => setMouseEnter(true);
    const handleMouseLeave = () => setMouseEnter(false);

    const classes = classNames({
        "nk-sidebar group/sidebar peer fixed w-72 [&.is-compact:not(.has-hover)]:w-[74px] min-h-screen max-h-screen overflow-hidden h-full start-0 top-0 z-[1031] transition-[transform,width] duration-300 -translate-x-full rtl:translate-x-full xl:translate-x-0 xl:rtl:translate-x-0 [&.sidebar-visible]:translate-x-0": true,
        "sidebar-visible": visibility,
        "nk-sidebar-mobile": mobile,
        "is-compact": compact,
        "has-hover": compact && mouseEnter,
        [`dark`]: theme.sidebar === "dark"
    });

  return (
    <>
    <div className={classes}>
        <div className="flex items-center min-w-full w-72 h-16  bg-white   dark:bg-gray-950 border-gray-200 border-b dark:border-gray-900 px-6 py-3 overflow-hidden">
            <div className="-ms-1 me-4">
                <div className="hidden xl:block">
                    <a href="#sidebar" onClick={(ev) => { ev.preventDefault(); setCompact(!compact) }} className="sidebar-compact-toggle [&>*]:pointer-events-none inline-flex items-center isolate relative h-9 w-9 px-1.5 before:content-[''] before:absolute before:-z-[1] before:h-5 before:w-5 hover:before:h-10 hover:before:w-10 before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:-translate-x-1/2  before:-translate-y-1/2 before:top-1/2 before:left-1/2 before:bg-gray-200 dark:before:bg-gray-900">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-2xl text-slate-600 dark:text-slate-300" name="menu" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
                    </a>
                </div>
                <div className="xl:hidden">
                    <SidebarToggle icon="arrow-left"  onClick={()=> setVisibility(!visibility)} />
                </div>
            </div>
            <div className="relative flex flex-shrink-0">
                <Link to="/home" className="relative inline-block transition-opacity duration-300 h-9 group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0">
                    <img className="h-full opacity-0 dark:opacity-100" src="/logo.svg" srcSet="/logo2x.png 2x" alt="logo" />
                    <img className="h-full opacity-100 dark:opacity-0 absolute start-0 top-0" src="/logo-dark.png" srcSet="/logo.svg" alt="logo" />
                </Link>
            </div>
        </div>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="nk-sidebar-body max-h-full relative overflow-hidden w-full bg-white dark:bg-gray-950 border-e border-gray-200 dark:border-gray-900">
            <div className="flex flex-col w-full h-[calc(100vh-theme(spacing.16))]">
                <Simplebar className='h-full pt-4 pb-10'>
                    <Menu setSidebarVisibility={setVisibility} />
                </Simplebar>
            </div>
        </div>
    </div>
    <div onClick={(ev) => { ev.preventDefault(); setVisibility(false) }} className="sidebar-toggle fixed inset-0 bg-slate-950 bg-opacity-20 z-[1030] opacity-0 invisible peer-[.sidebar-visible]:opacity-100 peer-[.sidebar-visible]:visible xl:!opacity-0 xl:!invisible"></div>
    </>
  )
}

export default Sidebar