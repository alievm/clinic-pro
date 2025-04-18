import React, {Fragment, useEffect} from 'react'
import {
    FiShoppingCart,
    FiEdit,
    FiTrendingUp,
    FiDollarSign,
    FiPieChart,
    FiBarChart,
  } from "react-icons/fi";
  import { LuChevronRight } from "react-icons/lu";
import slideUp from '../../utilities/slideUp';
import slideDown from '../../utilities/slideDown';
import getParents from '../../utilities/getParents';

import { NavLink, useLocation } from "react-router-dom";

const menuData = [
    { heading: "Asosiy Sahifalar" },
    { icon:
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.28685 9.11637L12.4351 4.13689C12.7819 3.92496 13.2181 3.92496 13.5649 4.13689L21.7131 9.11637C22.3572 9.50995 22.75 10.2104 22.75 10.9651V20.5834C22.75 21.78 21.7799 22.7501 20.5833 22.7501L5.41664 22.7501C4.22002 22.7501 3.24997 21.78 3.24997 20.5834L3.24999 10.9651C3.24999 10.2103 3.6428 9.50995 4.28685 9.11637ZM10.8333 14.0833C10.235 14.0833 9.74999 14.5684 9.74999 15.1667V18.4167C9.74999 19.015 10.235 19.5 10.8333 19.5H15.1667C15.765 19.5 16.25 19.015 16.25 18.4167V15.1667C16.25 14.5684 15.765 14.0833 15.1667 14.0833H10.8333Z" fill="currentColor"/>
        </svg>
        
        , text: "Bosh sahifa", link: "/" },
    { icon:
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M13 23.8333C7.61522 23.8333 3.25 19.4681 3.25 14.0833C3.25 8.69856 7.61522 4.33334 13 4.33334C18.3848 4.33334 22.75 8.69856 22.75 14.0833C22.75 19.4681 18.3848 23.8333 13 23.8333Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9599 8.125H13.0515C13.3298 8.125 13.5628 8.33587 13.5905 8.61277L14.0833 13.5417L17.6021 15.5524C17.7709 15.6488 17.875 15.8283 17.875 16.0227V16.25C17.875 16.4785 17.6898 16.6637 17.4613 16.6637C17.4245 16.6637 17.3879 16.6588 17.3524 16.6491L12.3486 15.2845C12.0979 15.2161 11.9311 14.9794 11.951 14.7203L12.4199 8.62512C12.4416 8.34292 12.6769 8.125 12.9599 8.125Z" fill="currentColor"/>
        </svg>
        
        
        , text: "Onlayn navbat", link: "/home" },
    { icon:  
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.3" d="M19.5 15.1667C17.7051 15.1667 16.25 13.7116 16.25 11.9167C16.25 10.1217 17.7051 8.66667 19.5 8.66667C21.2949 8.66667 22.75 10.1217 22.75 11.9167C22.75 13.7116 21.2949 15.1667 19.5 15.1667ZM9.74999 11.9167C7.35676 11.9167 5.41666 9.97657 5.41666 7.58333C5.41666 5.1901 7.35676 3.25 9.74999 3.25C12.1432 3.25 14.0833 5.1901 14.0833 7.58333C14.0833 9.97657 12.1432 11.9167 9.74999 11.9167Z" fill="currentColor"/>
        <path d="M19.068 16.2507C22.7583 16.291 25.7716 18.1568 25.9984 22.1C26.0075 22.2588 25.9984 22.75 25.4106 22.75H21.2333C21.2333 20.3115 20.4277 18.0612 19.068 16.2507ZM0.000705991 21.8825C0.420613 16.7121 4.61707 14.0833 9.73195 14.0833C14.9188 14.0833 19.1803 16.5676 19.4977 21.8833C19.5104 22.0951 19.4977 22.75 18.6839 22.75C14.6696 22.75 8.70429 22.75 0.788127 22.75C0.516438 22.75 -0.0221669 22.1641 0.000705991 21.8825Z" fill="currentColor"/>
        </svg>, text: "Bemorlar", link: "/copywriter" },
           { 
            icon:   <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M6.49999 2.16666H19.5C20.0983 2.16666 20.5833 2.65169 20.5833 3.25V13C20.5833 13.5983 20.0983 14.0833 19.5 14.0833H6.49999C5.90168 14.0833 5.41666 13.5983 5.41666 13V3.25C5.41666 2.65169 5.90168 2.16666 6.49999 2.16666ZM8.12499 5.41666C7.82584 5.41666 7.58332 5.65918 7.58332 5.95833C7.58332 6.25749 7.82584 6.5 8.12499 6.5H14.625C14.9241 6.5 15.1667 6.25749 15.1667 5.95833C15.1667 5.65918 14.9241 5.41666 14.625 5.41666H8.12499ZM8.12499 7.58333C7.82584 7.58333 7.58332 7.82584 7.58332 8.125C7.58332 8.42415 7.82584 8.66666 8.12499 8.66666H11.375C11.6741 8.66666 11.9167 8.42415 11.9167 8.125C11.9167 7.82584 11.6741 7.58333 11.375 7.58333H8.12499Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.10881 7.12025L13 13.5417L21.8912 7.12025C22.1337 6.9451 22.4723 6.99971 22.6475 7.24223C22.7141 7.33454 22.75 7.4455 22.75 7.55937V18.4167C22.75 19.6133 21.78 20.5833 20.5833 20.5833H5.41667C4.22005 20.5833 3.25 19.6133 3.25 18.4167V7.55937C3.25 7.26021 3.49251 7.0177 3.79167 7.0177C3.90553 7.0177 4.0165 7.05358 4.10881 7.12025Z" fill="currentColor"/>
            </svg>, text: "Katalog", link: "#",
            sub: [
                { text:"Project Cards", link: "/project-card" },
                { text:"Project List", link: "/project-list" }
            ]
        },  
           { 
            icon:   <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M7.04166 17.3333H8.12499C9.02245 17.3333 9.74999 18.0609 9.74999 18.9583V21.125C9.74999 22.0225 9.02245 22.75 8.12499 22.75H7.04166C6.14419 22.75 5.41666 22.0225 5.41666 21.125V18.9583C5.41666 18.0609 6.14419 17.3333 7.04166 17.3333ZM17.875 17.3333H18.9583C19.8558 17.3333 20.5833 18.0609 20.5833 18.9583V21.125C20.5833 22.0225 19.8558 22.75 18.9583 22.75H17.875C16.9775 22.75 16.25 22.0225 16.25 21.125V18.9583C16.25 18.0609 16.9775 17.3333 17.875 17.3333Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.41667 4.33334H20.5833C21.78 4.33334 22.75 5.30339 22.75 6.5V18.4167C22.75 19.6133 21.78 20.5833 20.5833 20.5833H5.41667C4.22005 20.5833 3.25 19.6133 3.25 18.4167V6.5C3.25 5.30339 4.22005 4.33334 5.41667 4.33334ZM16.7917 16.25C18.8857 16.25 20.5833 14.5524 20.5833 12.4583C20.5833 10.3643 18.8857 8.66667 16.7917 8.66667C14.6976 8.66667 13 10.3643 13 12.4583C13 14.5524 14.6976 16.25 16.7917 16.25ZM16.7917 14.0833C17.6891 14.0833 18.4167 13.3558 18.4167 12.4583C18.4167 11.5609 17.6891 10.8333 16.7917 10.8333C15.8942 10.8333 15.1667 11.5609 15.1667 12.4583C15.1667 13.3558 15.8942 14.0833 16.7917 14.0833ZM7.58333 8.66667C8.18164 8.66667 8.66667 9.15169 8.66667 9.75V11.9167C8.66667 12.515 8.18164 13 7.58333 13C6.98502 13 6.5 12.515 6.5 11.9167V9.75C6.5 9.15169 6.98502 8.66667 7.58333 8.66667Z" fill="currentColor"/>
            </svg>
            
            , text: "Qabul va to‘lov", link: "#",
            sub: [
                { text:"Project Cards", link: "/project-card" },
                { text:"Project List", link: "/project-list" }
            ]
        },  
           { 
            icon:   <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" d="M16.25 5.95834C16.25 5.06087 15.5225 4.33334 14.625 4.33334C13.7275 4.33334 13 5.06087 13 5.95834V16.7917C13 17.6891 13.7275 18.4167 14.625 18.4167C15.5225 18.4167 16.25 17.6891 16.25 16.7917V5.95834Z" fill="currentColor"/>
            <path opacity="0.3" d="M10.8333 11.375C10.8333 10.4775 10.1058 9.75 9.20833 9.75C8.31087 9.75 7.58333 10.4775 7.58333 11.375V16.7917C7.58333 17.6891 8.31087 18.4167 9.20833 18.4167C10.1058 18.4167 10.8333 17.6891 10.8333 16.7917V11.375Z" fill="currentColor"/>
            <path d="M5.41667 20.5833H21.6667C22.265 20.5833 22.75 21.0684 22.75 21.6667C22.75 22.265 22.265 22.75 21.6667 22.75H4.33333C3.73502 22.75 3.25 22.265 3.25 21.6667V4.33333C3.25 3.73502 3.73502 3.25 4.33333 3.25C4.93164 3.25 5.41667 3.73502 5.41667 4.33333V20.5833Z" fill="currentColor"/>
            <path opacity="0.3" d="M21.6667 13.5417C21.6667 12.6442 20.9391 11.9167 20.0417 11.9167C19.1442 11.9167 18.4167 12.6442 18.4167 13.5417V16.7917C18.4167 17.6891 19.1442 18.4167 20.0417 18.4167C20.9391 18.4167 21.6667 17.6891 21.6667 16.7917V13.5417Z" fill="currentColor"/>
            </svg>
            
            
            , text: "Statistika va hisobotlar", link: "#",
            sub: [
                { text:"Project Cards", link: "/project-card" },
                { text:"Project List", link: "/project-list" }
            ]
        },  
           { 
            icon:  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M22.1067 7.2974C22.4979 7.47128 22.75 7.85924 22.75 8.28736V17.7792C22.75 18.1727 22.5367 18.5352 22.1928 18.7262L13.5261 23.541C13.1989 23.7228 12.8011 23.7228 12.4739 23.541L3.80722 18.7262C3.4633 18.5352 3.25 18.1727 3.25 17.7792V8.28736C3.25 7.85924 3.50213 7.47128 3.89335 7.2974L12.56 3.44555C12.8401 3.32105 13.1599 3.32105 13.44 3.44555L22.1067 7.2974Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2144 4.57645L8.23334 9.01039V13.9812L10.4 15.0645V10.2853L18.693 5.67804L16.2144 4.57645Z" fill="currentColor"/>
            </svg>
            
            
            
            , text: "Sklad maxsulotlari", link: "#",
            sub: [
                { text:"Project Cards", link: "/project-card" },
                { text:"Project List", link: "/project-list" }
            ]
        },  
  ];

const Menu = ({setSidebarVisibility}) => {
    const location = useLocation();
    // variables for Sidebar
    let menu = {
        classes: {
            main: 'nk-menu',
            item:'nk-menu-item',
            link:'nk-menu-link',
            toggle: 'nk-menu-toggle',
            sub: 'nk-menu-sub',
            subparent: 'has-sub',
            active: 'active',
            current: 'current-page'
        },
    };

    let currentLink = function(selector){
        let elm = document.querySelectorAll(selector);
        elm.forEach(function(item){
            var activeRouterLink = item.classList.contains('active');
            if (activeRouterLink) {
                let parents = getParents(item,`.${menu.classes.main}`, menu.classes.item);
                parents.forEach(parentElemets =>{
                    parentElemets.classList.add(menu.classes.active, menu.classes.current);
                    let subItem = parentElemets.querySelector(`.${menu.classes.sub}`);
                    subItem !== null && (subItem.style.display = "block")
                })
                
            } else {
                item.parentElement.classList.remove(menu.classes.active, menu.classes.current);
            }
        })
    } 
    // dropdown toggle
    let dropdownToggle = function(elm){
        let parent = elm.parentElement;
        let nextelm = elm.nextElementSibling;
        let speed = nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;
        if(!parent.classList.contains(menu.classes.active)){
            parent.classList.add(menu.classes.active);
            slideDown(nextelm,speed);
        }else{
            parent.classList.remove(menu.classes.active);
            slideUp(nextelm,speed);
        }
    }

    // dropdown close siblings
    let closeSiblings = function(elm){
        let parent = elm.parentElement;
        let siblings = parent.parentElement.children;
        Array.from(siblings).forEach(item => {
        if(item !== parent){
            item.classList.remove(menu.classes.active);
            if(item.classList.contains(menu.classes.subparent)){
            let subitem = item.querySelectorAll(`.${menu.classes.sub}`);
            subitem.forEach(child => {
                child.parentElement.classList.remove(menu.classes.active);
                slideUp(child,400);
            })
            }
        }
        });
    }

    let menuToggle = function(e){
        e.preventDefault();
        let item = e.target.closest(`.${menu.classes.toggle}`)
        dropdownToggle(item);
        closeSiblings(item);
    }

    let routeChange = function(e){
        let selector = document.querySelectorAll(".nk-menu-link")
        selector.forEach((item, index)=>{
            if(item.classList.contains('active')){
                closeSiblings(item);
                item.parentElement.classList.add("active");
            }else{
                item.parentElement.classList.remove("active");
                currentLink(`.${menu.classes.link}`);
            }
        })
    }
    
    useEffect(() =>{
        routeChange();
    },[location.pathname])

    useEffect(() =>{
        currentLink(`.${menu.classes.link}`);
        // eslint-disable-next-line
    },[null])

  return (
    <ul className="nk-menu">
        {menuData.map((item,index) => 
            <Fragment key={index}>
                {!item.heading ? 
                    (
                        !item.sub ? 
                        <li className={`nk-menu-item py-0.5 group/item ${item.sub ? 'has-sub' : ''}`} >
                            <NavLink onClick={()=> setSidebarVisibility(false)} target={item.blank && "_blank"} className="nk-menu-link nk-route-toggle flex relative items-center align-middle py-2.5 ps-6 pe-10 font-heading font-medium font-aeonik tracking-snug group" to={item.link} end>
                                {item.icon && <span className="font-normal font-aeonik tracking-normal w-9 inline-flex flex-grow-0 flex-shrink-0 text-slate-400 group-[.active]/item:text-primary-500 group-hover:text-primary-500"><span className="text-xl text-slate-400 group-[.active]/item:text-primary-500 group-hover:text-primary-500">
  {item.icon}
</span>
</span>}
                                {item.text && <span className="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 flex-grow-1 inline-block whitespace-nowrap transition-all duration-300 text-slate-600 dark:text-slate-500 group-[.active]/item:text-primary-500 group-hover:text-primary-500">{item.text}</span>}
                            </NavLink>
                        </li>
                        : 
                        <li className={`nk-menu-item py-0.5 group/item ${item.sub ? 'has-sub' : ''}`} >
                            <a className="nk-menu-link nk-menu-toggle flex relative items-center align-middle py-2.5 ps-6 pe-10 font-heading font-medium font-aeonik tracking-snug group" onClick={menuToggle} href="#expand">
                                {item.icon && <span className="font-normal font-aeonik tracking-normal w-9 inline-flex flex-grow-0 flex-shrink-0 text-slate-400 group-[.active]/item:text-primary-500 group-hover:text-primary-500"><span className="text-xl text-slate-400 group-[.active]/item:text-primary-500 group-hover:text-primary-500">
  {item.icon}
</span>
</span>}
                                {item.text && <span className="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 flex-grow-1 inline-block whitespace-nowrap transition-all duration-300 text-slate-600 dark:text-slate-500 group-[.active]/item:text-primary-500 group-hover:text-primary-500">{item.text}</span>}
                                <LuChevronRight
  className="
    text-base 
    leading-none 
    text-slate-400 
    group-[.active]/item:text-primary-500 
    absolute 
    end-5 
    top-1/2 
    -translate-y-1/2 
    rtl:-scale-x-100 
    group-[.active]/item:rotate-90 
    group-[.active]/item:rtl:-rotate-90 
    transition-all 
    duration-300
  "
/>
                            </a>
                            <ul className="nk-menu-sub mb-1 hidden group-[&.is-compact:not(.has-hover)]/sidebar:!hidden">
                                {item.sub.map((itemsub1,index1) => 
                                    <Fragment key={index1}>
                                        {!itemsub1.sub ? 
                                            <li className={`nk-menu-item py-px group/sub1`} >
                                                <NavLink  onClick={()=> setSidebarVisibility(false)} target={itemsub1.blank && "_blank"} to={itemsub1.link} className="nk-menu-link nk-route-toggle flex relative items-center align-middle py-1.5 pe-10 ps-[calc(theme(spacing.6)+theme(spacing.9))] font-normal font-aeonik leading-5 text-sm tracking-normal normal-case" end>
                                                    <span className="text-slate-600 dark:text-slate-500 group-[.active]/sub1:text-primary-500 hover:text-primary-500 whitespace-nowrap flex-grow inline-block">{itemsub1.text}</span>
                                                </NavLink>
                                            </li>
                                            :
                                            <li className={`nk-menu-item py-px group/sub1 ${itemsub1.sub ? 'has-sub' : ''}`}>
                                                <a className="nk-menu-link nk-menu-toggle flex relative items-center align-middle py-1.5 pe-10 ps-[calc(theme(spacing.6)+theme(spacing.9))] font-normal font-aeonik leading-5 text-sm tracking-normal normal-case" onClick={menuToggle} href="#expand">
                                                    <span className="text-slate-600 dark:text-slate-500 group-[.active]/sub1:text-primary-500 hover:text-primary-500 whitespace-nowrap flex-grow inline-block">{itemsub1.text}</span>
                                                    <LuChevronRight
                                                      className="
                                                        text-base 
                                                        leading-none 
                                                        text-slate-400 
                                                        group-[.active]/sub1:text-primary-500 
                                                        absolute 
                                                        end-5 
                                                        top-1/2 
                                                        -translate-y-1/2 
                                                        rtl:-scale-x-100 
                                                        group-[.active]/sub1:rotate-90 
                                                        group-[.active]/sub1:rtl:-rotate-90 
                                                        transition-all 
                                                        duration-300"
                                                    />
                                                </a>
                                                <ul className="nk-menu-sub hidden ms-[calc(theme(spacing.6)+theme(spacing.9))] border-s border-gray-300 dark:border-gray-900 my-2">
                                                    {itemsub1.sub.map((itemsub2,index2) => 
                                                        <Fragment key={index2}>
                                                            <li className={`nk-menu-item py-px group/sub2`}>
                                                                <NavLink onClick={()=> setSidebarVisibility(false)} target={itemsub2.blank && "_blank"} to={itemsub2.link} className="nk-menu-link nk-route-toggle flex relative items-center align-middle py-1.5 pe-10 ps-4 font-normal font-aeonik leading-5 text-sm tracking-normal normal-case" end>
                                                                    <span className="text-slate-600 dark:text-slate-500 group-[.active]/sub2:text-primary-500 hover:text-primary-500 whitespace-nowrap flex-grow inline-block">{itemsub2.text}</span>
                                                                </NavLink>
                                                            </li>
                                                        </Fragment>
                                                    )}
                                                </ul>
                                            </li>}
                                    </Fragment>
                                )}
                            </ul>
                        </li>
                    )
                : 
                <li className="relative first:pt-1 pt-10 pb-2 px-6 before:absolute before:h-px before:w-full before:start-0 before:top-1/2 before:bg-gray-200 dark:before:bg-gray-900 first:before:hidden before:opacity-0 group-[&.is-compact:not(.has-hover)]/sidebar:before:opacity-100" >
                    <h6 className="group-[&.is-compact:not(.has-hover)]/sidebar:opacity-0 text-slate-400 dark:text-slate-300 whitespace-nowrap uppercase font-medium font-aeonik text-xs tracking-relaxed leading-tight">{item.heading}</h6>
                </li>}
            </Fragment>
        )}
    </ul>
  )
}

export default Menu