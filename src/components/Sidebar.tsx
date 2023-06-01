import { useState } from "react";
import { TbFileInvoice } from "react-icons/tb";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <header className="sidebar__header">
                <div>
                    <TbFileInvoice/>
                </div>
            </header>
        </aside>
    )
}

export default Sidebar;