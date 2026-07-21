function SkeletonPulse({ className, style }) {
  return (
    <div
      className={`rounded-3 skeleton-pulse ${className || ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(148,163,184,0.15) 0%, rgba(148,163,184,0.25) 50%, rgba(148,163,184,0.15) 100%)",
        backgroundSize: "200% 100%",
        animation: "skeletonPulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

function SkeletonLoader({ type = "deal" }) {
  const primaryWidths = ["70%", "85%", "65%", "90%", "75%"];
  const secondaryWidths = ["45%", "55%", "50%", "60%", "48%"];

  if (type === "dealDetails") {
    return (
      <div className="row gap-12 py-12">
        <div className="col-lg-8">
          <div className="mb-6">
            <SkeletonPulse
              className="mb-6"
              style={{ height: "30px", width: "100px" }}
            />
            <SkeletonPulse
              className="mb-2"
              style={{ height: "40px", width: "80%" }}
            />
            <SkeletonPulse
              className="mb-6"
              style={{ height: "20px", width: "60%" }}
            />
          </div>
          <SkeletonPulse
            className="rounded-2xl mb-12"
            style={{ height: "400px", width: "100%" }}
          />
          <SkeletonPulse
            className="mb-6"
            style={{ height: "30px", width: "30%" }}
          />
          <SkeletonPulse
            className="mb-2"
            style={{ height: "15px", width: "100%" }}
          />
          <SkeletonPulse
            className="mb-2"
            style={{ height: "15px", width: "95%" }}
          />
          <SkeletonPulse
            className="mb-2"
            style={{ height: "15px", width: "90%" }}
          />
        </div>
        <div className="col-lg-4">
          <div className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 card-shadow p-6 rounded-2xl bg-white dark:bg-slate-900 transition-colors">
            <SkeletonPulse
              className="mb-6"
              style={{ height: "20px", width: "50%" }}
            />
            <SkeletonPulse
              className="mb-6"
              style={{ height: "40px", width: "80%" }}
            />
            <SkeletonPulse
              className="mb-6"
              style={{ height: "30px", width: "100%" }}
            />
            <SkeletonPulse
              className="mb-6"
              style={{ height: "60px", width: "100%" }}
            />
            <SkeletonPulse
              className="rounded-full"
              style={{ height: "50px", width: "100%" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "category") {
    return (
      <div className="row gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="col-lg-4 col-md-6">
            <div className="flex flex-col relative min-w-0 break-words h-full shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 p-6 transition-colors">
              <div className="flex items-center mb-6">
                <SkeletonPulse
                  className="rounded-full mr-4"
                  style={{ width: "48px", height: "48px" }}
                />
                <SkeletonPulse style={{ height: "24px", width: "60%" }} />
              </div>
              <SkeletonPulse
                className="mb-2"
                style={{ height: "15px", width: "100%" }}
              />
              <SkeletonPulse style={{ height: "15px", width: "80%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        <div className="p-6">
          <SkeletonPulse
            className="mb-6"
            style={{ height: "24px", width: "30%" }}
          />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50 dark:border-slate-800"
            >
              <SkeletonPulse
                className="rounded-full"
                style={{ width: "36px", height: "36px" }}
              />
              <div className="grow">
                <SkeletonPulse
                  className="mb-2"
                  style={{
                    height: "14px",
                    width: primaryWidths[i] || "70%",
                  }}
                />

                <SkeletonPulse
                  className="mb-1"
                  style={{
                    height: "12px",
                    width: secondaryWidths[i] || "50%",
                  }}
                />
                <SkeletonPulse
                  style={{
                    height: "12px",
                    width: secondaryWidths[i] || "50%",
                  }}
                />
              </div>
              <SkeletonPulse style={{ height: "28px", width: "80px" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Default "deal" list skeleton
  return (
    <div className="row gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="col-lg-4 col-md-6">
          <div className="flex flex-col relative min-w-0 break-words h-full shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
            <SkeletonPulse
              style={{ height: "210px", borderRadius: "16px 16px 0 0" }}
            />
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <SkeletonPulse style={{ height: "20px", width: "60px" }} />
                <SkeletonPulse style={{ height: "20px", width: "70px" }} />
              </div>
              <SkeletonPulse
                className="mb-2"
                style={{ height: "22px", width: "85%" }}
              />
              <SkeletonPulse
                className="mb-2"
                style={{ height: "14px", width: "60%" }}
              />
              <SkeletonPulse
                className="mb-6"
                style={{ height: "14px", width: "100%" }}
              />
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end">
                  <div>
                    <SkeletonPulse
                      className="mb-1"
                      style={{ height: "28px", width: "90px" }}
                    />
                    <SkeletonPulse style={{ height: "14px", width: "60px" }} />
                  </div>
                  <SkeletonPulse
                    className="rounded-full"
                    style={{ height: "38px", width: "110px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
