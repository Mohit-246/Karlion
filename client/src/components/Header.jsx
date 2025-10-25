import React from "react";

function Header() {
  return (
    <>
      <div className="fixed w-full top-0 right-0 z-50 bg-gray-100">
        <div className="flex items-center justify-evenly p-8">
          <div className="hidden md:flex gap-6">
            <h2 className="playfair-display-sc-bold text-gray-400">BRAND</h2>
            <h2 className="playfair-display-sc-bold text-gray-400">LUXURY</h2>
          </div>
          <h1 className="bodoni-moda-sc-bold text-black text-shadow-2xs text-shadow-gray-400 text-4xl">
            Karlion
          </h1>
          <div className="hidden md:flex gap-6">
            <h2 className="playfair-display-sc-bold text-gray-400">QUALITY</h2>
            <h2 className="playfair-display-sc-bold text-gray-400">SUPPORT</h2>
          </div>
        </div>
        <div className="fixed w-full bg-black/70 py-4 text-gray-200 ">
          <nav className="flex flex-row items-center justify-center">
            <ul className="flex gap-12 inter-extrabold">
              <li className="hover:text-cyan-500 hover:brightness-110">ALL</li>
              <li className="hover:text-cyan-500 hover:brightness-110">MEN</li>
              <li className="hover:text-cyan-500 hover:brightness-110">WOMEN</li>
              <li className="hover:text-cyan-500 hover:brightness-110">KIDS</li>
              <li className="hover:text-cyan-500 hover:brightness-110">CLOTHES</li>
              <li className="hover:text-cyan-500 hover:brightness-110">SHOES</li>
              <li className="hover:text-cyan-500 hover:brightness-110">CART</li>
              <li className="hover:text-cyan-500 hover:brightness-110">PROFILE</li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
