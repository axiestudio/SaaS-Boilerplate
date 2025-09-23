export const DemoBadge = () => (
  <div className="fixed bottom-0 right-20 z-10">
    <a
      href="https://axiestudio.se"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
        <div className="flex items-center space-x-2">
          <img src="/axie-logo.webp" alt="Axie Studio" className="w-4 h-4" />
          <span>Powered by Axie Studio</span>
        </div>
      </div>
    </a>
  </div>
);
