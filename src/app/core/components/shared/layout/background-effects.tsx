export function BackgroundEffects() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-100/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl" />
    </div>
  );
}
