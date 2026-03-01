import Image from 'next/image';

export function ProblemSection() {
  return (
    <section id="problem" className="bg-slate-50/80 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left - content (middle part) */}
          <div className="flex-1 space-y-6 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] leading-[1.2] text-foreground sm:text-1xl md:text-1.5xl lg:text-[1.8rem]">
            Disrupting Product Compliance and Reporting

            </h2>
            <p className="text-lg font-normal font-semibold font-black-light leading-[1.75] tracking-[0.01em] text-zinc-600 sm:text-xl">
              Product compliance reporting is a slow, costly, and consultant-heavy process, just as global regulatory pressure and customers’ expectations continue to rise. 
            <br></br><br></br>
              ProductLens disrupts by accelerating affordable compliance and sustainability intelligence from months to minutes.
            </p>
            {/* <p className="text-base font-semibold tracking-[0.02em] text-foreground sm:text-lg">
              Upload a photo. Get a full, audit-ready analysis.
            </p> */}
          </div>

          {/* Right - image at real size */}
          <div className="relative flex flex-1 justify-end lg:min-w-[55%]">
            <div className="overflow-hidden rounded-[1.5rem] border-2 border-white bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.08)]">
              <Image
                src="/assets/problem/problem.png"
                alt="LCA Compliance - ProductLens solution"
                width={800}
                height={600}
                className="block max-w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
