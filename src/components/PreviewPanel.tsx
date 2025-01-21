import { Code2, Laptop, Zap } from "lucide-react";

export const PreviewPanel = () => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-primary-light px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-dark mb-6">
            Build Your Dream Website with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your ideas into beautiful websites instantly using the power of AI.
            No coding required, everything happens right in your browser.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get your website up and running in minutes, not hours",
              },
              {
                icon: Code2,
                title: "No Coding Required",
                description: "Just describe what you want, and AI does the rest",
              },
              {
                icon: Laptop,
                title: "Fully Responsive",
                description: "Looks great on all devices, from mobile to desktop",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};