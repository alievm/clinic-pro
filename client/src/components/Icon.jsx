import classNames from "classnames";
import React from "react";

const Icon = React.forwardRef(({ name, id, className, style, ...props },ref) => {
  const iconClass = classNames({
    [`${className}`]: className,
    'icon': true,
    'ni': true,
    [`ni-${name}`]: true,
  });
  return <em ref={ref} className={iconClass} id={id} style={style} {...props}></em>;
})
export default Icon;
