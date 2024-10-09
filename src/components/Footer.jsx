import React from "react";
import { FaFacebook } from "react-icons/fa6";
import { RiInstagramFill, RiTwitterXFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primaryColor text-white z-50 rounded-t-3xl mt-8 md:mt-0 ">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        <div>
          <h1 className="font-semibold text-3xl pb-4">Kitab Kunj</h1>
          <div className="flex gap-5 ml-3">
            <FaFacebook
              size={32}
              className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
            />
            <RiInstagramFill
              size={32}
              className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
            />
            <RiTwitterXFill
              size={32}
              className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
            />
          </div>
        </div>
        <div>
          <h1 className="font-medium text-lg pb-4 pt-5 md:pt-0">All Books</h1>
          <div className="flex flex-col gap-2">
            
          </div>
        </div>
        <div>
          <div>
            <h1 className="font-medium text-lg pb-4 pt-5 md:pt-0">Company</h1>
            <div className="flex flex-col gap-2">
              
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/4">
          <h1 className="font-medium text-lg pb-4 pt-5 md:pt-0">Contact us</h1>
          <div className="flex flex-col gap-2">
            <Link to="/">
              Birgunj, Parsa, Nepal
            </Link>
            <Link to="/">
              noobs@development.com
            </Link>
            <Link to="/">
              +977 980-111-1234
            </Link>
          </div>
        </div>
      </div>
      <div>
        <p className="text-center py-4">
          developed by
          <span className="text-black"> Noob Devs </span>
          {"\u00A9"} | All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
