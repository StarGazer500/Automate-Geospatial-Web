import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// More attractive color palette with better contrast
const COLORS = [
  '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#0099C6', '#DD4477',
  '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
  '#E67300', '#8B0707', '#329262', '#5574A6',
];

const DashBoardChart = ({ chartData }) => {
  const [hoveredChart, setHoveredChart] = useState(null);

  // Format data for Recharts and filter out zero values
  const OverralMaintenanceAssessData = [
    { name: 'Passed QC', value: chartData.analytics_data.overral_maintenance_assessment.passed_maintrnance_qc },
    { name: 'Failed QC', value: chartData.analytics_data.overral_maintenance_assessment.failed_maintenance_qc },
  ].filter(item => item.value > 0);

  const ActivityTypeAssessment = [
    { name: 'Maintenance Slashing', value: chartData.analytics_data.activity_assessment.maintenance_slashing },
    { name: 'Maintenance Ring Weeding', value: chartData.analytics_data.activity_assessment.maintenance_ring_weeding },
    { name: 'Post Emergent Regen Spray', value: chartData.analytics_data.activity_assessment.post_emergent_grass_regeneration_spray },
    { name: 'Liana Cutting / Enrichment Clearing', value: chartData.analytics_data.activity_assessment.liana_cutting_and__line_clearing_for_enrichment_planting },
    { name: 'Bush Clearing Maintenance', value: chartData.analytics_data.activity_assessment.bush_clearing_maintenace },
    { name: 'Spot Spray Woody Species', value: chartData.analytics_data.activity_assessment.spot_Spray_woody_species }
  ].filter(item => item.value > 0);

  const SpeciesAssessment = [
    { name: 'Terminalia ivorensis', value: chartData.analytics_data.species_assessment.Terminalia_ivorensis },
    { name: 'Terminalia superba', value: chartData.analytics_data.species_assessment.Terminalia_superba },
    { name: 'Tetrapleura tetraptera', value: chartData.analytics_data.species_assessment.Tetrapleura_tetraptera },
    { name: 'Milicia excelsa', value: chartData.analytics_data.species_assessment.Milicia_excelsa },
    { name: 'Nesogordonia papaverifera', value: chartData.analytics_data.species_assessment.Nesogordonia_papaverifera },
    { name: 'Pycnanthus angolensis', value: chartData.analytics_data.species_assessment.Pycnanthus_angolensis },
    { name: 'Albizia adianthifolia', value: chartData.analytics_data.species_assessment.Albizia_adianthifolia },
    { name: 'Entandrophragma angolense', value: chartData.analytics_data.species_assessment.Entandrophragma_angolense },
    { name: 'Cola lateritia', value: chartData.analytics_data.species_assessment.Cola_lateritia },
    { name: 'Ficus exasperata', value: chartData.analytics_data.species_assessment.Ficus_exasperata },
    { name: 'Bombax buonopozense', value: chartData.analytics_data.species_assessment.Bombax_buonopozense },
    { name: 'Ceiba pentandra', value: chartData.analytics_data.species_assessment.Ceiba_pentandra },
    { name: 'Cola gigantea', value: chartData.analytics_data.species_assessment.Cola_gigantea },
    { name: 'Mansonia altissima', value: chartData.analytics_data.species_assessment.Mansonia_altissima },
    { name: 'Pericopsis elata', value: chartData.analytics_data.species_assessment.Pericopsis_elata },
    { name: 'Celtics mildbraedii', value: chartData.analytics_data.species_assessment.Celtics_mildbraedii },
    { name: 'Unknown', value: chartData.analytics_data.species_assessment.Unknown },
    { name: 'Khaya anthotheca', value: chartData.analytics_data.species_assessment.Khaya_anthotheca }
  ].filter(item => item.value > 0);

  const QcReportAssessment = [
    { name: 'Felix Zagdong', value: chartData.analytics_data.qc_reporter_assessments.Felix_Zagdong },
    { name: 'Henry Ameyaw', value: chartData.analytics_data.qc_reporter_assessments.Henry_Ameyaw },
    { name: 'Isaac Boateng', value: chartData.analytics_data.qc_reporter_assessments.Isaac_Boateng },
    { name: 'Gregory Febiri Hareking', value: chartData.analytics_data.qc_reporter_assessments.Gregory_Febiri_Hareking },
    { name: 'Anthony Adu', value: chartData.analytics_data.qc_reporter_assessments.Anthony_Adu },
    { name: 'Brandford Anane_Acquah', value: chartData.analytics_data.qc_reporter_assessments.Brandford_Anane_Acquah },
    { name: 'Emmanuel Gyapong', value: chartData.analytics_data.qc_reporter_assessments.Emmanuel_Gyapong },
    { name: 'Sombi Richard', value: chartData.analytics_data.qc_reporter_assessments.Sombi_Richard },
    { name: 'Boateng Japhet Obeng', value: chartData.analytics_data.qc_reporter_assessments.Boateng_Japhet_Obeng },
    { name: 'Okyere Duku Festus', value: chartData.analytics_data.qc_reporter_assessments.Okyere_Duku_Festus },
    { name: 'Cecilia Kyeremateng', value: chartData.analytics_data.qc_reporter_assessments.Cecilia_Kyeremateng },
    { name: 'Nicholas Opoku', value: chartData.analytics_data.qc_reporter_assessments.Nicholas_Opoku },
    { name: 'Prince Baidoo', value: chartData.analytics_data.qc_reporter_assessments.Prince_Baidoo }
  ].filter(item => item.value > 0);

  const LandCoverAssessment = [
    { name: 'Natural Forest', value: chartData.analytics_data.land_cover_assessment.natural_forest },
    { name: 'Degraded Forest', value: chartData.analytics_data.land_cover_assessment.degraded_forest },
    { name: 'Farmland Active', value: chartData.analytics_data.land_cover_assessment.farmland_active },
    { name: 'Farmbush', value: chartData.analytics_data.land_cover_assessment.farmbush },
    { name: 'Deserted Farm', value: chartData.analytics_data.land_cover_assessment.deserted_farm },
    { name: 'Grassland', value: chartData.analytics_data.land_cover_assessment.grassland },
    { name: 'Waterlogged', value: chartData.analytics_data.land_cover_assessment.waterlogged },
    { name: 'Rocky Area', value: chartData.analytics_data.land_cover_assessment.rockyarea }
  ].filter(item => item.value > 0);

  const chartConfigs = [
    {
      id: "activity",
      title: "Maintenance Activity Assessment",
      data: ActivityTypeAssessment,
      icon: "🔄"
    },
    {
      id: "qc",
      title: "Overall Maintenance QC Assessment",
      data: OverralMaintenanceAssessData,
      icon: "✓"
    },
    {
      id: "species",
      title: "Species Assessment",
      data: SpeciesAssessment,
      icon: "🌳"
    },
    {
      id: "reporters",
      title: "QC Reporters Assessment",
      data: QcReportAssessment,
      icon: "👤"
    },
    {
      id: "landcover",
      title: "Land Cover Assessment",
      data: LandCoverAssessment,
      icon: "🏞️"
    }
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
    const shortName = name.length > 12 ? `${name.substring(0, 10)}...` : name;
    const percentValue = (percent * 100).toFixed(0);
    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={11}
        fontWeight="500"
      >
        {`${shortName}: ${percentValue}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-gray-600">
            Value: <span className="font-semibold">{data.value}</span>
          </p>
          <p className="text-gray-600">
            Percentage: <span className="font-semibold">{(data.payload.percent * 100).toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 w-full">
      {chartConfigs.map((chart, index) => (
        <div 
          key={chart.id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
          onMouseEnter={() => setHoveredChart(chart.id)}
          onMouseLeave={() => setHoveredChart(null)}
        >
          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
            <span className="text-xl mr-2">{chart.icon}</span>
            <h2 className="text-gray-800 text-lg font-medium">{chart.title}</h2>
          </div>
          <div className="p-4">
            <div className="w-full h-60">
              {chart.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chart.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      innerRadius={hoveredChart === chart.id ? "30%" : "0%"}
                      label={renderCustomLabel}
                      labelLine={false}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {chart.data.map((entry, idx) => (
                        <Cell 
                          key={`cell-${idx}`} 
                          fill={COLORS[idx % COLORS.length]} 
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ 
                        fontSize: '11px', 
                        fontWeight: '500',
                        paddingTop: '10px',
                        maxHeight: chart.data.length > 8 ? '100px' : 'auto', // Increased maxHeight for Species/Reporters
                        overflowY: chart.data.length > 8 ? 'auto' : 'visible', // Scroll only for large datasets
                        scrollbarWidth: 'thin',
                        lineHeight: '1.2', // Tighter line spacing
                        display: 'flex',
                        flexWrap: 'wrap', // Allow legend items to wrap
                        justifyContent: 'center', // Center-align items
                      }}
                      formatter={(value) => value.length > 18 ? `${value.substring(0, 18)}...` : value}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>No data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {chart.data.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              {chart.data.length} {chart.data.length === 1 ? 'item' : 'items'} | Total: {chart.data.reduce((sum, item) => sum + item.value, 0)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashBoardChart;