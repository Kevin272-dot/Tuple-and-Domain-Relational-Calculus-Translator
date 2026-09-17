import { Video } from "lucide-react";
import { Card } from "../ui/Card";

const videos = [
  {
    id: "4xb6ODQ9XFM",
    title: "Tuple Relational Calculus (Formal Definition)",
    description:
      "Covers the formal definition of TRC with formulas, examples, free and bound variables.",
  },
  {
    id: "yWlVeXEl344",
    title: "Domain Relational Calculus Explained",
    description:
      "Walks through DRC syntax and how domain variables work in practice.",
  },
];

export function AnimatedVideo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Video Tutorials
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Watch these to get a visual walkthrough of TRC and DRC concepts before
          trying the simulator.
        </p>
      </div>

      {videos.map((vid) => (
        <Card key={vid.id}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Video
              size={18}
              className="text-primary-600 dark:text-primary-400"
            />
            {vid.title}
          </h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${vid.id}`}
              title={vid.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {vid.description}
          </p>
        </Card>
      ))}
    </div>
  );
}
