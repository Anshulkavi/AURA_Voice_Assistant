// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="px-6 py-8 bg-gray-800 text-white mt-10">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p>&copy; 2024 AURA+. Pioneering the future of AI interaction.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-purple-400">Privacy Policy</a>
          <a href="#" className="hover:text-purple-400">Terms of Service</a>
          <a href="#" className="hover:text-purple-400">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
