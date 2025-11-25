"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// ---- Helpers
const fmtLabel = new Intl.DateTimeFormat(undefined, {
  month: "short",
  year: "numeric",
});

function firstOfMonth(year, monthIdx0) {
  return new Date(Date.UTC(year, monthIdx0, 1));
}
function addDays(d, days) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

// ---- Base monthly data (sample)
const baseMonthly = {
  2023: [100, 120, 150, 160, 180, 200, 250, 270, 220, 240, 210, 250],
  2024: [150, 120, 145, 160, 180, 387, 225, 210, 230, 126, 250, 300],
  2025: [200, 180, 210, 250, 300, 400, 350, 320, 310, 290, 330, 400],
};

/** Build a unified monthly series across 2023-2025. */
function buildSeries() {
  const rows = [];
  Object.keys(baseMonthly).forEach((yearKey) => {
    const year = Number(yearKey);
    baseMonthly[yearKey].forEach((val, idx0) => {
      rows.push({ date: firstOfMonth(year, idx0), value: val });
    });
  });
  rows.sort((a, b) => a.date - b.date);
  return rows;
}

const ALL_ROWS = buildSeries();

const LineChart = () => {
  const [chartHeight, setChartHeight] = useState("200px");

  // Period state (consistent with reports)
  const [rangeOpen, setRangeOpen] = useState(false);
  const [start, setStart] = useState(() => {
    // default: last 365 days (approx. 12 months)
    const endD = new Date();
    const startD = addDays(endD, -365);
    return new Date(
      Date.UTC(
        startD.getUTCFullYear(),
        startD.getUTCMonth(),
        startD.getUTCDate()
      )
    )
      .toISOString()
      .slice(0, 10);
  });
  const [end, setEnd] = useState(() => {
    const endD = new Date();
    return new Date(
      Date.UTC(endD.getUTCFullYear(), endD.getUTCMonth(), endD.getUTCDate())
    )
      .toISOString()
      .slice(0, 10);
  });

  // Responsive height
  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 768) setChartHeight("150px");
      else if (window.innerWidth < 1024) setChartHeight("200px");
      else setChartHeight("250px");
    };
    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  // Filter rows within date range
  const filtered = useMemo(() => {
    const s = new Date(start + "T00:00:00Z");
    const e = new Date(end + "T23:59:59Z");
    return ALL_ROWS.filter((r) => r.date >= s && r.date <= e);
  }, [start, end]);

  // Build chart.js dataset
  const data = useMemo(() => {
    const labels = filtered.map((r) => fmtLabel.format(r.date));
    const values = filtered.map((r) => r.value);
    return {
      labels,
      datasets: [
        {
          label: "Total Revenue",
          data: values,
          fill: false,
          borderColor: "#198248",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
          pointBorderColor: "#198248",
          pointBackgroundColor: "#3fae6a",
          pointRadius: 4,
          // increase the hit area so hovering near the line triggers the tooltip
          pointHitRadius: 12,
        },
      ],
    };
  }, [filtered]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          backgroundColor: "#3fae6a",
          padding: { x: 20, y: 2 },
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: () => null,
            label: (ctx) => `$${Number(ctx.raw ?? 0).toLocaleString()}`,
          },
        },
      },
      // allow tooltips when hovering near the line (not only on the exact points)
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: false,
      },
      scales: {
        x: {
          grid: { display: true, color: "#198248" },
          ticks: {
            color: "#181818",
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            font: {
              size:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 8
                  : 12,
            },
          },
        },
        y: {
          grid: { display: false },
          beginAtZero: false,
          ticks: {
            color: "#181818",
            padding:
              typeof window !== "undefined" && window.innerWidth < 768
                ? 10
                : 32,
            callback: (v) => `$${Number(v).toLocaleString()}K`,
            font: {
              size:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? 8
                  : 12,
            },
          },
        },
      },
    }),
    []
  );

  // Presets
  const applyPreset = (preset) => {
    const today = new Date();
    const endUtc = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );
    let startUtc;

    if (preset === "ytd") {
      startUtc = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
    } else {
      const days = Number(preset);
      startUtc = addDays(endUtc, -days);
    }

    setStart(startUtc.toISOString().slice(0, 10));
    setEnd(endUtc.toISOString().slice(0, 10));
    setRangeOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-secondary">
          Total Revenue
        </h2>

        {/* Period selector (Reports-style) */}
        <div className="flex items-center gap-2">
          {/* Presets */}
          {/* <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => applyPreset("7")}
              className="px-2.5 py-1 text-xs border rounded-md hover:bg-primary/10"
            >
              Last 7d
            </button>
            <button
              onClick={() => applyPreset("30")}
              className="px-2.5 py-1 text-xs border rounded-md hover:bg-primary/10"
            >
              Last 30d
            </button>
            <button
              onClick={() => applyPreset("90")}
              className="px-2.5 py-1 text-xs border rounded-md hover:bg-primary/10"
            >
              Last 90d
            </button>
            <button
              onClick={() => applyPreset("ytd")}
              className="px-2.5 py-1 text-xs border rounded-md hover:bg-primary/10"
            >
              YTD
            </button>
          </div> */}

          {/* Range picker (native) */}
          <div className="relative">
            <button
              onClick={() => setRangeOpen((v) => !v)}
              className="w-[230px] font-medium text-[14px] py-[10px] px-[12px] border border-primary text-secondary rounded-lg text-left flex justify-between items-center"
            >
              <span className="truncate">
                {start} — {end}
              </span>
              <span className="ml-2">📅</span>
            </button>

            {rangeOpen && (
              <div className="absolute right-0 z-10 mt-1 w-[280px] rounded-lg border border-primary bg-white p-3 shadow-lg">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full rounded-md border px-2 py-2 text-sm"
                    max={end}
                  />
                </div>
                <div className="space-y-2 mt-3">
                  <label className="block text-xs text-gray-500">
                    End date
                  </label>
                  <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full rounded-md border px-2 py-2 text-sm"
                    min={start}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setRangeOpen(false)}
                    className="px-3 py-1.5 text-sm rounded-md border"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setRangeOpen(false)}
                    className="px-3 py-1.5 text-sm rounded-md bg-[#00bcd4] text-white hover:bg-[#00acc1]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{ width: "100%", height: chartHeight }}
        className="text-white"
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;

// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Registering chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const LineChart = () => {
//   const [selectedYear, setSelectedYear] = useState(2025);
//   const [chartHeight, setChartHeight] = useState("200px");
//   const [isOpen, setIsOpen] = useState(false);

//   const years = [2023, 2024, 2025];

//   useEffect(() => {
//     const updateChartHeight = () => {
//       if (window.innerWidth < 768) setChartHeight("150px");
//       else if (window.innerWidth < 1024) setChartHeight("200px");
//       else setChartHeight("250px");
//     };

//     updateChartHeight();
//     window.addEventListener("resize", updateChartHeight);
//     return () => window.removeEventListener("resize", updateChartHeight);
//   }, []);

//   const allData = {
//     2023: {
//       labels: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       datasets: [
//         {
//           label: "Total Revenue",
//           data: [100, 120, 150, 160, 180, 200, 250, 270, 220, 240, 210, 250],
//           fill: false,
//           borderColor: "#3fae6a",
//           backgroundColor: "transparent",
//           tension: 0.4,
//           borderWidth: 2,
//           pointBorderColor: "#3fae6a",
//           pointBackgroundColor: "#3fae6a",
//           pointRadius: 4,
//         },
//       ],
//     },
//     2024: {
//       labels: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       datasets: [
//         {
//           label: "Total Revenue",
//           data: [150, 120, 145, 160, 180, 387, 225, 210, 230, 126, 250, 300],
//           fill: false,
//           borderColor: "#3fae6a",
//           backgroundColor: "transparent",
//           tension: 0.4,
//           borderWidth: 2,
//           pointBorderColor: "#3fae6a",
//           pointBackgroundColor: "#3fae6a",
//           pointRadius: 4,
//         },
//       ],
//     },
//     2025: {
//       labels: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       datasets: [
//         {
//           label: "Total Revenue",
//           data: [200, 180, 210, 250, 300, 400, 350, 320, 310, 290, 330, 400],
//           fill: false,
//           borderColor: "#198248",
//           backgroundColor: "transparent",
//           tension: 0.4,
//           borderWidth: 2,
//           pointBorderColor: "#198248",
//           pointBackgroundColor: "#3fae6a",
//           pointRadius: 4,
//         },
//       ],
//     },
//   };

//   const data = allData[selectedYear];

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         titleColor: "#ffffff",
//         bodyColor: "#ffffff",
//         backgroundColor: "#3fae6a",
//         padding: { x: 20, y: 2 },
//         cornerRadius: 8,
//         displayColors: false,
//         callbacks: {
//           title: () => null,
//           label: (context) => `$${context.raw.toLocaleString()}`,
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: { display: true, color: "#198248" },
//         ticks: {
//           color: "#181818",
//           maxRotation: 45,
//           minRotation: 0,
//           autoSkip: true,
//           font: { size: window.innerWidth < 768 ? 8 : 12 },
//         },
//       },
//       y: {
//         grid: { display: false },
//         beginAtZero: false,
//         ticks: {
//           color: "#181818",
//           padding: window.innerWidth < 768 ? 10 : 32,
//           callback: (value) => `$${value.toLocaleString()}K`,
//           font: { size: window.innerWidth < 768 ? 8 : 12 },
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
//         <h2 className="text-lg sm:text-xl font-bold text-secondary">
//           Total Revenue
//         </h2>

//         {/* Custom dropdown like Statistics select */}
//         <div className="relative inline-block w-[150px]">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full font-medium text-[14px] py-[12px] px-[16px] border border-primary text-secondary rounded-lg text-left flex justify-between items-center"
//           >
//             {selectedYear}
//             <span className="ml-2">▼</span>
//           </button>

//           {isOpen && (
//             <ul className="absolute z-10 w-full bg-white border border-primary rounded-lg mt-1 shadow-lg">
//               {years.map((year) => (
//                 <li
//                   key={year}
//                   onClick={() => {
//                     setSelectedYear(year);
//                     setIsOpen(false);
//                   }}
//                   className="cursor-pointer px-4 py-2 text-black hover:bg-primary/10"
//                 >
//                   {year}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       <div
//         style={{ width: "100%", height: chartHeight }}
//         className="text-white"
//       >
//         <Line data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default LineChart;
