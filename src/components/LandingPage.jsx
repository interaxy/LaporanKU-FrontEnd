import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

// Import assets
import illustration from "../assets/illustration.png";
import logo from "../assets/logo.png";
import gambar1 from "../assets/gambar1.png";
import gambar2 from "../assets/gambar2.png";
import gambar3 from "../assets/gambar3.png";
import gambar4 from "../assets/gambar4.png";

const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
    }
};

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const handleMobileNavClick = (id) => {
        scrollToSection(id);
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navbar */}
            <header className="bg-white shadow-md py-3 md:py-4 fixed top-0 w-full z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img src={logo} alt="LaporanKU Logo" className="h-8 sm:h-10 mr-2 sm:mr-3" />
                        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
                            LaporanKU
                        </h1>
                    </div>

                    {/* Menu Navigasi (Desktop) */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={() => scrollToSection("Home")}
                            className="text-sm font-medium hover:text-blue-500 transition"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => scrollToSection("Tangkapan-Layar")}
                            className="text-sm font-medium hover:text-blue-500 transition"
                        >
                            Tangkapan Layar
                        </button>
                    </nav>

                    {/* Login & Register (Desktop) */}
                    <div className="hidden md:flex space-x-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                        >
                            Masuk
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 text-sm text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition"
                        >
                            Daftar
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden flex items-center"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-blue-600" />
                        ) : (
                            <Menu className="h-6 w-6 text-blue-600" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white py-3 px-4 sm:px-6 shadow-lg">
                        <nav className="flex flex-col space-y-3">
                            <button
                                onClick={() => handleMobileNavClick("Home")}
                                className="text-left py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-500"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => handleMobileNavClick("Tangkapan-Layar")}
                                className="text-left py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-500"
                            >
                                Tangkapan Layar
                            </button>
                            <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                                <Link
                                    to="/login"
                                    className="py-2 px-3 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="py-2 px-3 text-center text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition"
                                >
                                    Daftar
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Wrapper konten agar tidak ketabrak navbar */}
            <main className="flex-1 pt-20 md:pt-24">
                {/* Hero Section */}
                <section
                    id="Home"
                    className="scroll-mt-24 flex items-center bg-blue-50 min-h-[calc(100vh-5rem)] py-10 md:py-0"
                >
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center px-4 sm:px-6">
                        {/* Teks Hero - tampil dulu di mobile */}
                        <div className="order-1 md:order-1 text-center md:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-700 leading-tight">
                                Aplikasi Laporan untuk Karyawan Utility
                            </h1>
                            <p className="mt-4 text-gray-600 text-base sm:text-lg">
                                Membantu karyawan dalam reporting, serta memberikan analisis
                                reporting yang terstruktur dan mudah dijalankan.
                            </p>
                            <Link
                                to="/login"
                                className="mt-6 inline-block px-6 py-3 text-sm sm:text-base text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                            >
                                Masuk
                            </Link>
                        </div>

                        {/* Ilustrasi */}
                        <div className="order-2 md:order-2 flex justify-center">
                            <img
                                src={illustration}
                                alt="Illustration"
                                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Tangkapan Layar Section */}
                <section
                    id="Tangkapan-Layar"
                    className="scroll-mt-24 py-16 md:py-24 bg-gray-50"
                >
                    <div className="max-w-6xl mx-auto text-center px-4 sm:px-6">
                        <h3 className="text-base sm:text-lg font-semibold text-blue-600">
                            Tangkapan Layar
                        </h3>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight mt-2">
                            Telusuri fitur-fitur utama{" "}
                            <span className="text-blue-600">LaporanKU</span>
                        </h2>

                        {/* Grid Tangkapan Layar */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-16">
                            {/* Kartu 1 */}
                            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-5 text-center">
                                <div className="bg-gray-200 rounded-lg mb-4 inline-block border border-gray-300 overflow-hidden">
                                    <img
                                        src={gambar1}
                                        alt="Dashboard LaporanKU"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                                <h4 className="text-lg sm:text-2xl font-semibold text-black">
                                    Dashboard
                                </h4>
                            </div>

                            {/* Kartu 2 */}
                            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-5 text-center">
                                <div className="bg-gray-200 rounded-lg mb-4 inline-block border border-gray-300 overflow-hidden">
                                    <img
                                        src={gambar2}
                                        alt="Halaman Laporan"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                                <h4 className="text-lg sm:text-2xl font-semibold text-black">
                                    Laporan
                                </h4>
                            </div>

                            {/* Kartu 3 */}
                            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-5 text-center">
                                <div className="bg-gray-200 rounded-lg mb-4 inline-block border border-gray-300 overflow-hidden">
                                    <img
                                        src={gambar3}
                                        alt="Halaman Checklist"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                                <h4 className="text-lg sm:text-2xl font-semibold text-black">
                                    Checklist
                                </h4>
                            </div>

                            {/* Kartu 4 */}
                            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-5 text-center">
                                <div className="bg-gray-200 rounded-lg mb-4 inline-block border border-gray-300 overflow-hidden">
                                    <img
                                        src={gambar4}
                                        alt="Ekspor PDF"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                                <h4 className="text-lg sm:text-2xl font-semibold text-black">
                                    Eksport ke PDF
                                </h4>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Copyright Section */}
            <footer className="bg-white text-black text-center py-4">
                <p className="text-xs sm:text-sm">
                    Copyright © LaporanKU 2025. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
