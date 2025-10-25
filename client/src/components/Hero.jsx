import React from "react";

function Hero() {
  return (
    <>
      <section className="h-screen w-screen mt-40 justify-center text-white flex items-center">
        <div className=" w-screen h-screen  px-10 py-16">
          <div className="flex flex-col gap-3 w-1/2 my-4 p-6 text-white text-shadow-lg">
            <h2 className="inter-semibold text-lg ">Hi! Welcome to Karlion</h2>
            <h1 className="text-5xl playfair-display-sc-bold ">
              REFINE YOUR STYLE. EVERYDAY
            </h1>
            <h2 className="inter-semibold text-lg">
              Discover timeless pieces and trend-setting outfits made to elevate
              Your Wardrobe.
            </h2>
          </div>
          <div className="flex gap-4  px-6 items-center ">
            <button className="px-3 py-2 rounded-full inter-semibold text-white bg-cyan-500 shadow-md transform duration-300 hover:scale-110">
              Explore Products
            </button>
            <button className="px-3 py-2 rounded-full inter-semibold text-cyan-500 bg-white shadow-md transform duration-300 hover:scale-110">
              View Products
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
