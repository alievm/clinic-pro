import React from 'react';
import classNames from 'classnames';
import Icon from './Icon';

const SidebarToggle = ({ className, onClick, icon }) => {
    const classes = classNames({
        "sidebar-toggle [&>*]:pointer-events-none inline-flex items-center isolate relative h-9 w-9 px-1.5 before:content-[''] before:absolute before:-z-[1] before:h-5 before:w-5 hover:before:h-10 hover:before:w-10 before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:-translate-x-1/2  before:-translate-y-1/2 before:top-1/2 before:left-1/2 before:bg-gray-200 dark:before:bg-gray-900": true,
        "rtl:-scale-x-100": icon === "arrow-left",
        [`${className}`]: className,
    });
    return (
        <button
        className={classes}
        onClick={onClick}
        >
            <Icon name={icon} className="text-2xl text-slate-600 dark:text-slate-300" />
        </button>
    )
}

export default SidebarToggle