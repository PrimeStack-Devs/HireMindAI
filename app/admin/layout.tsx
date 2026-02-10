import React from 'react'

function layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            {children}
        </div>
    )
}

export default layout