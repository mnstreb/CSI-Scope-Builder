import { createRoot } from 'react-dom/client'; // Make sure this is at the top
import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Download,
  Upload,
  Search,
  ChevronDown,
  X,
  PanelLeft,
  ChevronRight,
  ChevronLeft,
  DollarSign
} from 'lucide-react';

// ==========================================
// 1. DATA: COMPREHENSIVE CSI MASTERFORMAT
// ==========================================
const INITIAL_DATA = {
  "00": {
    title: "Procurement and Contracting Requirements",
    sections: {
      "00 10": { title: "Solicitation", sub: { "00 11 00": "Advertisements and Invitations", "00 11 13": "Advertisement for Bids" } },
      "00 20": { title: "Instructions for Procurement", sub: { "00 21 00": "Instructions", "00 21 13": "Instructions to Bidders", "00 22 00": "Supplementary Instructions", "00 24 00": "Procurement Scopes", "00 24 13": "Scopes of Bids" } },
      "00 30": { title: "Available Information", sub: { "00 31 00": "Available Project Information", "00 31 13": "Preliminary Schedules", "00 31 32": "Geotechnical Data" } },
      "00 40": { title: "Procurement Forms and Supplements", sub: { "00 41 00": "Bid Forms", "00 43 00": "Procurement Form Supplements", "00 43 13": "Bid Security Form" } },
      "00 50": { title: "Contracting Forms and Supplements", sub: { "00 51 00": "Notice of Award", "00 52 00": "Agreement Forms" } },
      "00 60": { title: "Project Forms", sub: { "00 61 00": "Bond Forms", "00 62 00": "Certificates and Other Forms" } },
      "00 70": { title: "Conditions of the Contract", sub: { "00 72 00": "General Conditions", "00 73 00": "Supplementary Conditions" } }
    }
  },
  "01": {
    title: "General Requirements",
    sections: {
      "01 10": { title: "Summary", sub: { "01 11 00": "Summary of Work", "01 14 00": "Work Restrictions" } },
      "01 20": { title: "Price and Payment Procedures", sub: { "01 21 00": "Allowances", "01 22 00": "Unit Prices", "01 23 00": "Alternates", "01 25 00": "Substitution Procedures", "01 26 00": "Contract Modification Procedures", "01 29 00": "Payment Procedures" } },
      "01 30": { title: "Administrative Requirements", sub: { "01 31 00": "Project Management and Coordination", "01 32 00": "Construction Progress Documentation", "01 33 00": "Submittal Procedures", "01 35 00": "Special Procedures" } },
      "01 40": { title: "Quality Requirements", sub: { "01 41 00": "Regulatory Requirements", "01 42 00": "References", "01 43 00": "Quality Assurance", "01 45 00": "Quality Control" } },
      "01 50": { title: "Temporary Facilities and Controls", sub: { "01 51 00": "Temporary Utilities", "01 52 00": "Construction Facilities", "01 54 00": "Construction Aids", "01 55 00": "Vehicular Access and Parking", "01 56 00": "Temporary Barriers and Enclosures", "01 57 00": "Temporary Controls", "01 58 00": "Project Identification" } },
      "01 60": { title: "Product Requirements", sub: { "01 61 00": "Common Product Requirements", "01 62 00": "Product Options", "01 64 00": "Owner-Furnished Products", "01 65 00": "Product Delivery Requirements", "01 66 00": "Product Storage and Handling Requirements" } },
      "01 70": { title: "Execution and Closeout Requirements", sub: { "01 71 00": "Examination and Preparation", "01 73 00": "Execution", "01 74 00": "Cleaning and Waste Management", "01 75 00": "Starting and Adjusting", "01 77 00": "Closeout Procedures", "01 78 00": "Closeout Submittals", "01 79 00": "Demonstration and Training" } }
    }
  },
  "02": {
    title: "Existing Conditions",
    sections: {
      "02 20": { title: "Assessment", sub: { "02 21 00": "Surveys", "02 22 00": "Existing Conditions Assessment", "02 24 00": "Environmental Assessment", "02 26 00": "Hazardous Material Assessment" } },
      "02 30": { title: "Subsurface Investigation", sub: { "02 32 00": "Geotechnical Investigations" } },
      "02 40": { title: "Demolition and Structure Moving", sub: { "02 41 00": "Demolition", "02 41 13": "Selective Site Demolition", "02 41 16": "Structure Demolition", "02 41 19": "Selective Demolition", "02 42 00": "Removal and Diversion of Construction Materials", "02 43 00": "Structure Moving" } },
      "02 50": { title: "Site Remediation", sub: { "02 51 00": "Physical Decontamination", "02 55 00": "Remediation Soil Stabilization", "02 56 00": "Site Containment" } },
      "02 60": { title: "Contaminated Site Material Removal", sub: { "02 61 00": "Removal and Disposal of Contaminated Soils", "02 65 00": "Underground Storage Tank Removal" } },
      "02 80": { title: "Facility Remediation", sub: { "02 81 00": "Transportation and Disposal of Hazardous Materials", "02 82 00": "Asbestos Remediation", "02 82 13": "Asbestos Abatement", "02 83 00": "Lead Remediation", "02 84 00": "Polychlorinate Biphenyl Remediation", "02 87 00": "Biohazard Remediation" } }
    }
  },
  "03": {
    title: "Concrete",
    sections: {
      "03 10": { title: "Concrete Forming and Accessories", sub: { "03 11 00": "Concrete Forming", "03 11 13": "Structural Cast-in-Place Concrete Forming", "03 15 00": "Concrete Accessories" } },
      "03 20": { title: "Concrete Reinforcing", sub: { "03 21 00": "Reinforcing Steel", "03 22 00": "Fabricated Reinforcing", "03 24 00": "Fibrous Reinforcing" } },
      "03 30": { title: "Cast-in-Place Concrete", sub: { "03 30 00": "Cast-in-Place Concrete", "03 31 00": "Structural Concrete", "03 33 00": "Architectural Concrete", "03 35 00": "Concrete Finishing", "03 39 00": "Concrete Curing" } },
      "03 40": { title: "Precast Concrete", sub: { "03 41 00": "Precast Structural Concrete", "03 45 00": "Precast Architectural Concrete", "03 47 00": "Site-Cast Concrete", "03 48 00": "Precast Concrete Specialties" } },
      "03 50": { title: "Cast Decks and Underlayment", sub: { "03 51 00": "Cast Roof Decks", "03 53 00": "Concrete Topping", "03 54 00": "Cast Underlayment" } },
      "03 60": { title: "Grouting", sub: { "03 61 00": "Cementitious Grouting", "03 62 00": "Non-Shrink Grouting", "03 63 00": "Epoxy Grouting" } },
      "03 80": { title: "Concrete Cutting and Boring", sub: { "03 81 00": "Concrete Cutting", "03 82 00": "Concrete Boring" } }
    }
  },
  "04": {
    title: "Masonry",
    sections: {
      "04 05": { title: "Common Work Results for Masonry", sub: { "04 05 13": "Masonry Mortaring", "04 05 16": "Masonry Grouting", "04 05 19": "Masonry Anchorage and Reinforcing" } },
      "04 20": { title: "Unit Masonry", sub: { "04 21 00": "Clay Unit Masonry", "04 21 13": "Brick Masonry", "04 22 00": "Concrete Unit Masonry (CMU)", "04 23 00": "Glass Unit Masonry" } },
      "04 40": { title: "Stone Assemblies", sub: { "04 42 00": "Exterior Stone Cladding", "04 43 00": "Stone Masonry", "04 43 13": "Stone Masonry Veneer" } },
      "04 50": { title: "Refractory Masonry", sub: { "04 57 00": "Masonry Fireplaces" } },
      "04 70": { title: "Manufactured Masonry", sub: { "04 71 00": "Manufactured Brick Masonry", "04 72 00": "Cast Stone Masonry", "04 73 00": "Manufactured Stone Masonry" } }
    }
  },
  "05": {
    title: "Metals",
    sections: {
      "05 10": { title: "Structural Metal Framing", sub: { "05 12 00": "Structural Steel Framing", "05 12 23": "Structural Steel for Buildings", "05 14 00": "Structural Aluminum Framing" } },
      "05 20": { title: "Metal Joists", sub: { "05 21 00": "Steel Joist Framing" } },
      "05 30": { title: "Metal Decking", sub: { "05 31 00": "Steel Decking" } },
      "05 40": { title: "Cold-Formed Metal Framing", sub: { "05 41 00": "Structural Metal Stud Framing", "05 42 00": "Cold-Formed Metal Joist Framing", "05 44 00": "Cold-Formed Metal Trusses" } },
      "05 50": { title: "Metal Fabrications", sub: { "05 51 00": "Metal Stairs", "05 52 00": "Metal Railings", "05 53 00": "Metal Gratings", "05 55 00": "Metal Stair Treads and Nosings", "05 58 00": "Formed Metal Fabrications" } },
      "05 70": { title: "Decorative Metal", sub: { "05 71 00": "Decorative Metal Stairs", "05 73 00": "Decorative Metal Railings", "05 75 00": "Decorative Formed Metal" } }
    }
  },
  "06": {
    title: "Wood, Plastics, and Composites",
    sections: {
      "06 10": { title: "Rough Carpentry", sub: { "06 11 00": "Wood Framing", "06 12 00": "Structural Panels", "06 13 00": "Heavy Timber", "06 15 00": "Wood Decking", "06 16 00": "Sheathing", "06 17 00": "Shop-Fabricated Structural Wood", "06 18 00": "Glued-Laminated Construction" } },
      "06 20": { title: "Finish Carpentry", sub: { "06 22 00": "Millwork", "06 25 00": "Prefinished Paneling", "06 26 00": "Board Paneling" } },
      "06 40": { title: "Architectural Woodwork", sub: { "06 41 00": "Architectural Wood Casework", "06 42 00": "Wood Paneling", "06 43 00": "Wood Stairs and Railings", "06 44 00": "Ornamental Woodwork", "06 46 00": "Wood Trim", "06 48 00": "Wood Frames" } },
      "06 60": { title: "Plastic Fabrications", sub: { "06 61 00": "Cast Polymer Fabrications", "06 63 00": "Plastic Railings", "06 64 00": "Plastic Paneling", "06 65 00": "Plastic Trim" } },
      "06 80": { title: "Composite Fabrications", sub: { "06 81 00": "Composite Railings", "06 82 00": "Composite Trim", "06 83 00": "Composite Paneling" } }
    }
  },
  "07": {
    title: "Thermal and Moisture Protection",
    sections: {
      "07 10": { title: "Dampproofing and Waterproofing", sub: { "07 11 00": "Dampproofing", "07 12 00": "Built-up Bituminous Waterproofing", "07 13 00": "Sheet Waterproofing", "07 14 00": "Fluid-Applied Waterproofing", "07 16 00": "Cementitious and Reactive Waterproofing", "07 17 00": "Bentonite Waterproofing", "07 19 00": "Water Repellents" } },
      "07 20": { title: "Thermal Protection", sub: { "07 21 00": "Thermal Insulation", "07 21 13": "Board Insulation", "07 21 16": "Blanket Insulation", "07 21 19": "Foamed-In-Place Insulation", "07 21 29": "Sprayed Insulation", "07 22 00": "Roof and Deck Insulation", "07 24 00": "Exterior Insulation and Finish Systems (EIFS)", "07 25 00": "Weather Barriers", "07 26 00": "Vapor Retarders", "07 27 00": "Air Barriers" } },
      "07 30": { title: "Steep Slope Roofing", sub: { "07 31 00": "Shingles and Shakes", "07 31 13": "Asphalt Shingles", "07 31 26": "Slate Shingles", "07 31 29": "Wood Shingles and Shakes", "07 32 00": "Roof Tiles", "07 33 00": "Natural Roof Coverings" } },
      "07 40": { title: "Roofing and Siding Panels", sub: { "07 41 00": "Roof Panels", "07 41 13": "Metal Roof Panels", "07 42 00": "Wall Panels", "07 42 13": "Metal Wall Panels", "07 46 00": "Siding", "07 46 23": "Wood Siding", "07 46 33": "Plastic Siding", "07 46 46": "Fiber-Cement Siding" } },
      "07 50": { title: "Membrane Roofing", sub: { "07 51 00": "Built-Up Bituminous Roofing", "07 52 00": "Modified Bituminous Membrane Roofing", "07 53 00": "Elastomeric Membrane Roofing (EPDM)", "07 54 00": "Thermoplastic Membrane Roofing (TPO/PVC)", "07 55 00": "Protected Membrane Roofing", "07 56 00": "Fluid-Applied Roofing" } },
      "07 60": { title: "Flashing and Sheet Metal", sub: { "07 61 00": "Sheet Metal Roofing", "07 62 00": "Sheet Metal Flashing and Trim", "07 62 23": "Fabricated Gutters and Downspouts", "07 65 00": "Flexible Flashing" } },
      "07 70": { title: "Roof and Wall Specialties and Accessories", sub: { "07 71 00": "Roof Specialties", "07 72 00": "Roof Accessories", "07 72 33": "Roof Hatches", "07 72 73": "Vegetated Roof Systems", "07 77 00": "Wall Specialties" } },
      "07 80": { title: "Fire and Smoke Protection", sub: { "07 81 00": "Applied Fire Protection", "07 84 00": "Firestopping", "07 84 13": "Penetration Firestopping", "07 84 43": "Joint Firestopping" } },
      "07 90": { title: "Joint Protection", sub: { "07 91 00": "Preformed Joint Seals", "07 92 00": "Joint Sealants", "07 95 00": "Expansion Control" } }
    }
  },
  "08": {
    title: "Openings",
    sections: {
      "08 10": { title: "Doors and Frames", sub: { "08 11 00": "Metal Doors and Frames", "08 11 13": "Hollow Metal Doors and Frames", "08 11 13.16": "Custom Hollow Metal Doors and Frames", "08 11 16": "Aluminum Doors and Frames", "08 11 19": "Stainless-Steel Doors and Frames", "08 12 00": "Metal Frames", "08 13 00": "Metal Doors", "08 14 00": "Wood Doors", "08 14 16": "Flush Wood Doors", "08 14 33": "Stile and Rail Wood Doors", "08 15 00": "Plastic Doors", "08 16 00": "Composite Doors", "08 17 00": "Integrated Door Opening Assemblies" } },
      "08 30": { title: "Specialty Doors and Frames", sub: { "08 31 00": "Access Doors and Panels", "08 32 00": "Sliding Glass Doors", "08 33 00": "Coiling Doors and Grilles", "08 33 23": "Overhead Coiling Doors", "08 33 26": "Overhead Coiling Grilles", "08 34 00": "Special Function Doors", "08 35 00": "Folding Doors and Grilles", "08 36 00": "Sectional Doors", "08 38 00": "Traffic Doors" } },
      "08 40": { title: "Entrances, Storefronts, and Curtain Walls", sub: { "08 41 00": "Entrances and Storefronts", "08 41 13": "Aluminum-Framed Entrances and Storefronts", "08 42 29": "Automatic Entrances", "08 43 00": "Storefronts", "08 44 00": "Curtain Wall and Glazed Assemblies", "08 44 13": "Glazed Aluminum Curtain Walls", "08 45 00": "Translucent Wall and Roof Assemblies" } },
      "08 50": { title: "Windows", sub: { "08 51 00": "Metal Windows", "08 51 13": "Aluminum Windows", "08 52 00": "Wood Windows", "08 53 00": "Plastic Windows", "08 53 13": "Vinyl Windows", "08 54 00": "Composite Windows", "08 55 00": "Pressure-Resistant Windows", "08 56 00": "Special Function Windows" } },
      "08 60": { title: "Roof Windows and Skylights", sub: { "08 61 00": "Roof Windows", "08 62 00": "Unit Skylights", "08 63 00": "Metal-Framed Skylights" } },
      "08 70": { title: "Hardware", sub: { "08 71 00": "Door Hardware", "08 71 13": "Automatic Door Operators", "08 74 00": "Access Control Hardware", "08 75 00": "Window Hardware" } },
      "08 80": { title: "Glazing", sub: { "08 81 00": "Glass Glazing", "08 83 00": "Mirrors", "08 84 00": "Plastic Glazing", "08 87 00": "Glazing Surface Films", "08 88 00": "Special Function Glazing", "08 88 13": "Fire-Rated Glazing" } },
      "08 90": { title: "Louvers and Vents", sub: { "08 91 00": "Louvers", "08 92 00": "Louvered Equipment Enclosures", "08 95 00": "Vents" } }
    }
  },
  "09": {
    title: "Finishes",
    sections: {
      "09 20": { title: "Plaster and Gypsum Board", sub: { "09 21 16": "Gypsum Board Assemblies", "09 22 00": "Supports for Plaster and Gypsum Board", "09 22 16": "Non-Structural Metal Framing", "09 22 36": "Lath", "09 23 00": "Gypsum Plastering", "09 24 00": "Cement Plastering (Stucco)", "09 26 00": "Veneer Plastering", "09 28 00": "Backing Boards and Underlayments", "09 29 00": "Gypsum Board" } },
      "09 30": { title: "Tiling", sub: { "09 30 13": "Ceramic Tiling", "09 30 23": "Glass Tiling", "09 30 33": "Stone Tiling", "09 31 00": "Thin-Set Tiling", "09 32 00": "Mortar-Bed Tiling" } },
      "09 50": { title: "Ceilings", sub: { "09 51 00": "Acoustical Ceilings", "09 51 13": "Acoustical Panel Ceilings", "09 51 23": "Acoustical Tile Ceilings", "09 53 00": "Acoustical Ceiling Suspension Assemblies", "09 54 00": "Specialty Ceilings", "09 54 23": "Linear Metal Ceilings" } },
      "09 60": { title: "Flooring", sub: { "09 61 00": "Flooring Treatment", "09 62 00": "Specialty Flooring", "09 63 00": "Masonry Flooring", "09 64 00": "Wood Flooring", "09 65 00": "Resilient Flooring", "09 65 13": "Resilient Base and Accessories", "09 65 16": "Resilient Sheet Flooring", "09 65 19": "Resilient Tile Flooring", "09 65 66": "Resilient Athletic Flooring", "09 66 00": "Terrazzo Flooring", "09 67 00": "Fluid-Applied Flooring", "09 68 00": "Carpeting", "09 68 13": "Tile Carpeting", "09 68 16": "Sheet Carpeting", "09 69 00": "Access Flooring" } },
      "09 70": { title: "Wall Finishes", sub: { "09 72 00": "Wall Coverings", "09 74 00": "Flexible Wood Sheets", "09 77 00": "Special Wall Surfacing", "09 77 13": "Stretched-Fabric Wall Systems", "09 77 23": "Fabric-Wrapped Panels" } },
      "09 80": { title: "Acoustic Treatment", sub: { "09 81 00": "Acoustic Insulation", "09 83 00": "Acoustic Finishes", "09 84 00": "Acoustic Room Components", "09 84 13": "Fixed Sound-Absorptive Panels" } },
      "09 90": { title: "Painting and Coating", sub: { "09 91 00": "Painting", "09 91 13": "Exterior Painting", "09 91 23": "Interior Painting", "09 93 00": "Staining and Transparent Finishing", "09 96 00": "High-Performance Coatings", "09 96 56": "Epoxy Coatings" } }
    }
  },
  "10": {
    title: "Specialties",
    sections: {
      "10 10": { title: "Information Specialties", sub: { "10 11 00": "Visual Display Units", "10 11 13": "Chalkboards", "10 11 16": "Markerboards", "10 11 23": "Tackboards", "10 14 00": "Signage", "10 14 19": "Dimensional Letter Signage", "10 14 23": "Panel Signage" } },
      "10 20": { title: "Interior Specialties", sub: { "10 21 00": "Compartments and Cubicles", "10 21 13": "Toilet Compartments", "10 22 00": "Partitions", "10 22 19": "Demountable Partitions", "10 22 23": "Portable Partitions, Screens, and Panels", "10 22 39": "Folding Panel Partitions", "10 26 00": "Wall and Door Protection", "10 26 13": "Corner Guards", "10 28 00": "Toilet, Bath, and Laundry Accessories", "10 28 13": "Toilet Accessories" } },
      "10 30": { title: "Fireplaces and Stoves", sub: { "10 31 00": "Manufactured Fireplaces", "10 32 00": "Fireplace Specialties" } },
      "10 40": { title: "Safety Specialties", sub: { "10 43 00": "Emergency Aid Specialties", "10 44 00": "Fire Protection Specialties", "10 44 13": "Fire Protection Cabinets", "10 44 16": "Fire Extinguishers" } },
      "10 50": { title: "Storage Specialties", sub: { "10 51 00": "Lockers", "10 51 13": "Metal Lockers", "10 55 00": "Postal Specialties", "10 56 00": "Storage Assemblies", "10 56 13": "Metal Storage Shelving", "10 57 00": "Wardrobe and Closet Specialties" } },
      "10 70": { title: "Exterior Specialties", sub: { "10 71 00": "Exterior Protection", "10 71 13": "Exterior Sun Control Devices", "10 73 00": "Protective Covers", "10 73 13": "Awnings", "10 73 16": "Canopies", "10 73 26": "Walkway Coverings", "10 75 00": "Flagpoles" } }
    }
  },
  "11": {
    title: "Equipment",
    sections: {
      "11 10": { title: "Vehicle and Pedestrian Equipment", sub: { "11 11 00": "Vehicle Service Equipment", "11 12 00": "Parking Control Equipment", "11 13 00": "Loading Dock Equipment", "11 13 13": "Loading Dock Bumpers", "11 13 19": "Stationary Loading Dock Equipment", "11 14 00": "Pedestrian Control Equipment" } },
      "11 20": { title: "Commercial Equipment", sub: { "11 21 00": "Retail and Service Equipment", "11 22 00": "Banking Equipment", "11 28 00": "Office Equipment" } },
      "11 30": { title: "Residential Equipment", sub: { "11 30 13": "Residential Appliances", "11 31 00": "Residential Appliances", "11 32 00": "Unit Kitchens" } },
      "11 40": { title: "Foodservice Equipment", sub: { "11 41 00": "Foodservice Storage Equipment", "11 42 00": "Food Preparation Equipment", "11 44 00": "Food Cooking Equipment", "11 46 00": "Food Dispensing Equipment", "11 48 00": "Foodservice Cleaning and Disposal Equipment" } },
      "11 50": { title: "Educational and Scientific Equipment", sub: { "11 51 00": "Library Equipment", "11 52 00": "Audio-Visual Equipment", "11 52 13": "Projection Screens", "11 53 00": "Laboratory Equipment", "11 53 13": "Laboratory Fume Hoods" } },
      "11 60": { title: "Entertainment and Recreation Equipment", sub: { "11 61 00": "Broadcast, Theater, and Stage Equipment", "11 66 00": "Athletic Equipment", "11 66 23": "Gymnasium Equipment", "11 68 00": "Play Field Equipment and Structures", "11 68 13": "Playground Equipment" } },
      "11 70": { title: "Healthcare Equipment", sub: { "11 72 00": "Examination and Treatment Equipment", "11 73 00": "Patient Care Equipment" } }
    }
  },
  "12": {
    title: "Furnishings",
    sections: {
      "12 10": { title: "Art", sub: { "12 11 00": "Murals", "12 12 00": "Wall Decorations", "12 17 00": "Art Glass" } },
      "12 20": { title: "Window Treatments", sub: { "12 21 00": "Window Blinds", "12 22 00": "Curtains and Drapes", "12 23 00": "Interior Shutters", "12 24 00": "Window Shades" } },
      "12 30": { title: "Casework", sub: { "12 32 00": "Manufactured Wood Casework", "12 34 00": "Manufactured Plastic Casework", "12 35 00": "Specialty Casework", "12 36 00": "Countertops", "12 36 61": "Simulated Stone Countertops" } },
      "12 40": { title: "Furnishings and Accessories", sub: { "12 48 00": "Rugs and Mats", "12 48 13": "Entrance Floor Mats and Frames" } },
      "12 50": { title: "Furniture", sub: { "12 51 00": "Office Furniture", "12 52 00": "Seating", "12 54 00": "Hospitality Furniture", "12 56 00": "Institutional Furniture", "12 58 00": "Residential Furniture", "12 59 00": "Systems Furniture" } },
      "12 60": { title: "Multiple Seating", sub: { "12 61 00": "Fixed Audience Seating", "12 63 00": "Stadium and Arena Seating", "12 66 00": "Telescoping Stands" } },
      "12 90": { title: "Other Furnishings", sub: { "12 93 00": "Interior Public Space Furnishings", "12 93 13": "Bicycle Racks", "12 93 23": "Trash and Litter Receptacles" } }
    }
  },
  "13": {
    title: "Special Construction",
    sections: {
      "13 10": { title: "Special Facility Components", sub: { "13 11 00": "Swimming Pools", "13 12 00": "Fountains", "13 13 00": "Aquariums", "13 17 00": "Tubs and Pools" } },
      "13 20": { title: "Special Purpose Rooms", sub: { "13 21 00": "Controlled Environment Rooms", "13 21 26": "Cold Storage Rooms", "13 24 00": "Special Activity Rooms", "13 24 16": "Saunas" } },
      "13 30": { title: "Special Structures", sub: { "13 31 00": "Fabric Structures", "13 32 00": "Space Frames", "13 34 00": "Fabricated Engineered Structures", "13 34 13": "Glazed Structures", "13 34 19": "Metal Building Systems" } },
      "13 40": { title: "Integrated Construction", sub: { "13 42 00": "Building Modules and Components", "13 48 00": "Sound, Vibration, and Seismic Control", "13 49 00": "Radiation Protection" } }
    }
  },
  "14": {
    title: "Conveying Equipment",
    sections: {
      "14 10": { title: "Dumbwaiters", sub: { "14 11 00": "Manual Dumbwaiters", "14 12 00": "Electric Dumbwaiters" } },
      "14 20": { title: "Elevators", sub: { "14 21 00": "Electric Traction Elevators", "14 24 00": "Hydraulic Elevators", "14 27 00": "Custom Elevator Cabs and Doors", "14 28 00": "Elevator Equipment and Controls" } },
      "14 30": { title: "Escalators and Moving Walks", sub: { "14 31 00": "Escalators", "14 32 00": "Moving Walks" } },
      "14 40": { title: "Lifts", sub: { "14 41 00": "People Lifts", "14 42 00": "Wheelchair Lifts", "14 43 00": "Platform Lifts", "14 45 00": "Vehicle Lifts" } },
      "14 90": { title: "Other Conveying Equipment", sub: { "14 91 00": "Facility Chutes", "14 91 82": "Trash Chutes", "14 92 00": "Pneumatic Tube Systems" } }
    }
  },
  "21": {
    title: "Fire Suppression",
    sections: {
      "21 05": { title: "Common Work Results for Fire Suppression", sub: { "21 05 19": "Meters and Gages", "21 05 23": "General-Duty Valves", "21 05 29": "Hangers and Supports", "21 05 33": "Heat Tracing", "21 05 48": "Vibration and Seismic Controls", "21 05 53": "Identification for Fire-Suppression Piping" } },
      "21 10": { title: "Water-Based Fire-Suppression Systems", sub: { "21 11 00": "Facility Fire-Suppression Water-Service Piping", "21 12 00": "Fire-Suppression Standpipes", "21 13 00": "Fire-Suppression Sprinkler Systems", "21 13 13": "Wet-Pipe Sprinkler Systems", "21 13 16": "Dry-Pipe Sprinkler Systems" } },
      "21 20": { title: "Fire-Extinguishing Systems", sub: { "21 21 00": "Carbon-Dioxide Fire-Extinguishing Systems", "21 22 00": "Clean-Agent Fire-Extinguishing Systems", "21 23 00": "Wet-Chemical Fire-Extinguishing Systems", "21 24 00": "Dry-Chemical Fire-Extinguishing Systems" } },
      "21 30": { title: "Fire Pumps", sub: { "21 31 00": "Centrifugal Fire Pumps", "21 32 00": "Vertical-Turbine Fire Pumps" } }
    }
  },
  "22": {
    title: "Plumbing",
    sections: {
      "22 05": { title: "Common Work Results for Plumbing", sub: { "22 05 19": "Meters and Gages", "22 05 23": "General-Duty Valves", "22 05 29": "Hangers and Supports", "22 05 33": "Heat Tracing", "22 05 48": "Vibration and Seismic Controls", "22 05 53": "Identification for Plumbing Piping" } },
      "22 07": { title: "Plumbing Insulation", sub: { "22 07 16": "Plumbing Equipment Insulation", "22 07 19": "Plumbing Piping Insulation" } },
      "22 10": { title: "Plumbing Piping", sub: { "22 11 00": "Facility Water Distribution", "22 11 16": "Domestic Water Piping", "22 11 19": "Domestic Water Piping Specialties", "22 11 23": "Domestic Water Pumps", "22 13 00": "Facility Sanitary Sewerage", "22 13 16": "Sanitary Waste and Vent Piping", "22 13 19": "Sanitary Waste Piping Specialties", "22 13 29": "Sanitary Sewerage Pumps", "22 14 00": "Facility Storm Drainage", "22 14 13": "Facility Storm Drainage Piping", "22 14 23": "Storm Drainage Piping Specialties", "22 14 26": "Facility Storm Drains", "22 14 29": "Sump Pumps" } },
      "22 30": { title: "Plumbing Equipment", sub: { "22 31 00": "Domestic Water Softeners", "22 33 00": "Electric Domestic Water Heaters", "22 34 00": "Fuel-Fired Domestic Water Heaters", "22 35 00": "Domestic Water Heat Exchangers" } },
      "22 40": { title: "Plumbing Fixtures", sub: { "22 41 00": "Residential Plumbing Fixtures", "22 42 00": "Commercial Plumbing Fixtures", "22 42 13": "Commercial Water Closets", "22 42 16": "Commercial Lavatories", "22 42 19": "Commercial Bathtubs", "22 42 23": "Commercial Showers", "22 42 39": "Commercial Faucets", "22 43 00": "Healthcare Plumbing Fixtures", "22 45 00": "Emergency Plumbing Fixtures", "22 47 00": "Drinking Fountains and Water Coolers" } }
    }
  },
  "23": {
    title: "HVAC",
    sections: {
      "23 05": { title: "Common Work Results for HVAC", sub: { "23 05 13": "Common Motor Requirements", "23 05 19": "Meters and Gages", "23 05 23": "General-Duty Valves", "23 05 29": "Hangers and Supports", "23 05 48": "Vibration and Seismic Controls", "23 05 53": "Identification for HVAC Piping", "23 05 93": "Testing, Adjusting, and Balancing" } },
      "23 07": { title: "HVAC Insulation", sub: { "23 07 13": "Duct Insulation", "23 07 16": "HVAC Equipment Insulation", "23 07 19": "HVAC Piping Insulation" } },
      "23 09": { title: "Instrumentation and Control for HVAC", sub: { "23 09 13": "Instrumentation and Control Devices", "23 09 23": "Direct-Digital Control System for HVAC", "23 09 33": "Electric and Electronic Control System for HVAC" } },
      "23 10": { title: "Facility Fuel Systems", sub: { "23 11 00": "Facility Fuel Piping", "23 12 00": "Facility Fuel Pumps", "23 13 00": "Facility Fuel-Storage Tanks" } },
      "23 20": { title: "HVAC Piping and Pumps", sub: { "23 21 00": "Hydronic Piping and Pumps", "23 21 13": "Hydronic Piping", "23 21 23": "Hydronic Pumps", "23 22 00": "Steam and Condensate Heating Piping", "23 23 00": "Refrigerant Piping", "23 25 00": "HVAC Water Treatment" } },
      "23 30": { title: "HVAC Air Distribution", sub: { "23 31 00": "HVAC Ducts and Casings", "23 31 13": "Metal Ducts", "23 33 00": "Air Duct Accessories", "23 33 13": "Dampers", "23 34 00": "HVAC Fans", "23 35 00": "Special Exhaust Systems", "23 36 00": "Air Terminal Units", "23 37 00": "Air Outlets and Inlets", "23 38 00": "Ventilation Hoods" } },
      "23 40": { title: "HVAC Air Cleaning Devices", sub: { "23 41 00": "Particulate Air Filtration", "23 43 00": "Electronic Air Cleaners" } },
      "23 50": { title: "Central Heating Equipment", sub: { "23 51 00": "Breechings, Chimneys, and Stacks", "23 52 00": "Heating Boilers", "23 54 00": "Furnaces", "23 55 00": "Fuel-Fired Heaters", "23 57 00": "Heat Exchangers for HVAC" } },
      "23 60": { title: "Central Cooling Equipment", sub: { "23 61 00": "Refrigerant Compressors", "23 62 00": "Packaged Compressor and Condenser Units", "23 63 00": "Refrigerant Condensers", "23 64 00": "Packaged Water Chillers", "23 65 00": "Cooling Towers" } },
      "23 70": { title: "Central HVAC Equipment", sub: { "23 72 00": "Air-to-Air Energy Recovery Equipment", "23 73 00": "Indoor Central-Station Air-Handling Units", "23 74 00": "Packaged Outdoor HVAC Equipment", "23 76 00": "Evaporative Air-Cooling Equipment" } },
      "23 80": { title: "Decentralized HVAC Equipment", sub: { "23 81 00": "Decentralized Unitary HVAC Equipment", "23 81 26": "Split-System Air-Conditioners", "23 82 00": "Convection Heating and Cooling Units", "23 82 19": "Fan Coil Units", "23 82 39": "Unit Heaters", "23 83 00": "Radiant Heating and Cooling Units", "23 84 00": "Humidity Control Equipment" } }
    }
  },
  "25": {
    title: "Integrated Automation",
    sections: {
      "25 05": { title: "Common Work Results", sub: { "25 05 00": "Common Work Results for Integrated Automation" } },
      "25 10": { title: "Integrated Automation Network Equipment", sub: { "25 11 00": "Integrated Automation Network Devices" } },
      "25 30": { title: "Integrated Automation Instrumentation", sub: { "25 35 00": "Integrated Automation Instrumentation and Terminal Devices for HVAC" } },
      "25 50": { title: "Integrated Automation Facility Controls", sub: { "25 51 00": "Integrated Automation Control of Facility Equipment" } },
      "25 90": { title: "Integrated Automation Control Sequences", sub: { "25 91 00": "Integrated Automation Control Sequences for Facility Equipment" } }
    }
  },
  "26": {
    title: "Electrical",
    sections: {
      "26 05": { title: "Common Work Results for Electrical", sub: { "26 05 19": "Low-Voltage Electrical Power Conductors and Cables", "26 05 26": "Grounding and Bonding for Electrical Systems", "26 05 29": "Hangers and Supports for Electrical Systems", "26 05 33": "Raceway and Boxes for Electrical Systems", "26 05 43": "Underground Ducts and Raceways", "26 05 53": "Identification for Electrical Systems" } },
      "26 09": { title: "Instrumentation and Control for Electrical Systems", sub: { "26 09 13": "Electrical Power Monitoring", "26 09 23": "Lighting Control Devices", "26 09 43": "Network Lighting Controls" } },
      "26 10": { title: "Medium-Voltage Electrical Distribution", sub: { "26 11 00": "Substations", "26 12 00": "Medium-Voltage Transformers", "26 13 00": "Medium-Voltage Switchgear" } },
      "26 20": { title: "Low-Voltage Electrical Distribution", sub: { "26 22 00": "Low-Voltage Transformers", "26 24 00": "Switchboards and Panelboards", "26 24 13": "Switchboards", "26 24 16": "Panelboards", "26 24 19": "Motor-Control Centers", "26 25 00": "Low-Voltage Enclosed Bus Assemblies", "26 27 00": "Low-Voltage Distribution Equipment", "26 27 26": "Wiring Devices", "26 28 00": "Low-Voltage Circuit Protective Devices", "26 29 00": "Low-Voltage Controllers" } },
      "26 30": { title: "Facility Electrical Power Generating and Storing Equipment", sub: { "26 31 00": "Photovoltaic Collectors", "26 32 00": "Packaged Generator Assemblies", "26 32 13": "Engine Generators", "26 36 00": "Transfer Switches" } },
      "26 40": { title: "Electrical and Cathodic Protection", sub: { "26 41 00": "Facility Lightning Protection", "26 43 00": "Surge Protective Devices" } },
      "26 50": { title: "Lighting", sub: { "26 51 00": "Interior Lighting", "26 51 13": "Incandescent Interior Lighting", "26 51 19": "LED Interior Lighting", "26 52 00": "Safety Lighting", "26 53 00": "Exit Signs", "26 56 00": "Exterior Lighting" } }
    }
  },
  "27": {
    title: "Communications",
    sections: {
      "27 05": { title: "Common Work Results for Communications", sub: { "27 05 26": "Grounding and Bonding for Communications Systems", "27 05 28": "Pathways for Communications Systems" } },
      "27 10": { title: "Structured Cabling", sub: { "27 11 00": "Communications Equipment Room Fittings", "27 13 00": "Communications Backbone Cabling", "27 15 00": "Communications Horizontal Cabling" } },
      "27 20": { title: "Data Communications", sub: { "27 21 00": "Data Communications Network Equipment", "27 22 00": "Data Communications Hardware" } },
      "27 30": { title: "Voice Communications", sub: { "27 32 00": "Voice Communications Terminal Equipment" } },
      "27 40": { title: "Audio-Video Communications", sub: { "27 41 00": "Audio-Video Systems" } },
      "27 50": { title: "Distributed Communications and Monitoring", sub: { "27 51 00": "Distributed Audio-Video Communications Systems", "27 52 00": "Healthcare Communications and Monitoring Systems", "27 53 00": "Distributed Systems", "27 53 13": "Clock Systems" } }
    }
  },
  "28": {
    title: "Electronic Safety and Security",
    sections: {
      "28 05": { title: "Common Work Results for Electronic Safety and Security", sub: { "28 05 13": "Servers, Workstations and Storage", "28 05 26": "Grounding and Bonding" } },
      "28 10": { title: "Access Control", sub: { "28 13 00": "Access Control Software", "28 14 00": "Access Control System Hardware", "28 15 00": "Integrated Access Control Hardware Devices", "28 16 00": "Access Control Interfaces" } },
      "28 20": { title: "Video Surveillance", sub: { "28 21 00": "Surveillance Cameras", "28 23 00": "Video Management System" } },
      "28 30": { title: "Security Detection, Alarm, and Monitoring", sub: { "28 31 00": "Intrusion Detection" } },
      "28 40": { title: "Life Safety", sub: { "28 46 00": "Fire Detection and Alarm", "28 46 21.11": "Addressable Fire-Alarm Systems" } }
    }
  },
  "31": {
    title: "Earthwork",
    sections: {
      "31 05": { title: "Common Work Results for Earthwork", sub: { "31 05 13": "Soils for Earthwork", "31 05 16": "Aggregates for Earthwork", "31 05 19": "Geosynthetics for Earthwork" } },
      "31 10": { title: "Site Clearing", sub: { "31 11 00": "Clearing and Grubbing", "31 12 00": "Selective Clearing", "31 13 00": "Selective Tree and Shrub Removal", "31 14 00": "Earth Stripping and Stockpiling" } },
      "31 20": { title: "Earth Moving", sub: { "31 21 00": "Off-Gassing Mitigation", "31 22 00": "Grading", "31 23 00": "Excavation and Fill", "31 23 16": "Excavation", "31 23 16.13": "Trenching", "31 23 16.26": "Rock Removal", "31 23 19": "Dewatering", "31 23 23": "Fill", "31 23 33": "Trenching and Backfilling", "31 24 00": "Embankments", "31 25 00": "Erosion and Sedimentation Controls" } },
      "31 30": { title: "Earthwork Methods", sub: { "31 31 00": "Soil Treatment", "31 31 16": "Termite Control", "31 32 00": "Soil Stabilization", "31 32 19": "Geosynthetic Soil Stabilization", "31 33 00": "Rock Stabilization", "31 34 00": "Soil Reinforcement", "31 35 00": "Slope Protection", "31 36 00": "Gabions", "31 37 00": "Riprap" } },
      "31 40": { title: "Shoring and Underpinning", sub: { "31 41 00": "Shoring", "31 41 16": "Sheet Piling", "31 43 00": "Concrete Raising", "31 45 00": "Vibroflotation and Densification", "31 46 00": "Needle Beams", "31 48 00": "Underpinning" } },
      "31 50": { title: "Excavation Support and Protection", sub: { "31 51 00": "Anchor Tiebacks", "31 52 00": "Cofferdams", "31 56 00": "Slurry Walls" } },
      "31 60": { title: "Special Foundations and Load-Bearing Elements", sub: { "31 62 00": "Driven Piles", "31 62 13": "Concrete Piles", "31 62 16": "Steel Piles", "31 62 19": "Timber Piles", "31 63 00": "Bored Piles", "31 63 16": "Auger Cast Grout Piles", "31 63 26": "Drilled Caissons", "31 63 29": "Drilled Concrete Piers and Shafts", "31 64 00": "Caissons", "31 66 00": "Special Foundations", "31 68 00": "Foundation Anchors" } },
      "31 70": { title: "Tunneling and Mining", sub: { "31 71 00": "Tunnel Excavation", "31 72 00": "Tunnel Support Systems", "31 73 00": "Tunnel Grouting", "31 74 00": "Tunnel Construction", "31 75 00": "Shaft Construction" } }
    }
  },
  "32": {
    title: "Exterior Improvements",
    sections: {
      "32 05": { title: "Common Work Results for Exterior Improvements", sub: { "32 05 13": "Soils for Exterior Improvements", "32 05 16": "Aggregates for Exterior Improvements", "32 05 19": "Geosynthetics for Exterior Improvements", "32 05 23": "Cement and Concrete for Exterior Improvements" } },
      "32 10": { title: "Bases, Ballasts, and Paving", sub: { "32 11 00": "Base Courses", "32 11 23": "Aggregate Base Courses", "32 11 26": "Asphaltic Base Courses", "32 11 36": "Concrete Base Courses", "32 12 00": "Flexible Paving", "32 12 13": "Preparatory Coats", "32 12 16": "Asphalt Paving", "32 12 36": "Seal Coats", "32 12 73": "Asphalt Paving Joint Sealants", "32 13 00": "Rigid Paving", "32 13 13": "Concrete Paving", "32 13 73": "Concrete Paving Joint Sealants", "32 14 00": "Unit Paving", "32 14 13": "Precast Concrete Unit Paving", "32 14 16": "Brick Unit Paving", "32 15 00": "Aggregate Surfacing", "32 16 00": "Curbs, Gutters, Sidewalks, and Driveways", "32 17 00": "Paving Specialties", "32 17 13": "Parking Bumpers", "32 17 23": "Pavement Markings", "32 17 26": "Tactile Warning Surfacing", "32 18 00": "Athletic and Recreational Surfacing" } },
      "32 30": { title: "Site Improvements", sub: { "32 31 00": "Fences and Gates", "32 31 13": "Chain Link Fences and Gates", "32 31 19": "Decorative Metal Fences and Gates", "32 31 29": "Wood Fences and Gates", "32 32 00": "Retaining Walls", "32 32 13": "Cast-in-Place Concrete Retaining Walls", "32 32 16": "Precast Concrete Retaining Walls", "32 32 23": "Segmental Retaining Walls", "32 33 00": "Site Furnishings", "32 33 13": "Site Bicycle Racks", "32 33 23": "Site Trash and Litter Receptacles", "32 33 33": "Site Manufactured Planters", "32 33 43": "Site Seating and Tables", "32 34 00": "Fabricated Bridges", "32 35 00": "Screening Devices", "32 39 00": "Manufactured Site Specialties", "32 39 13": "Manufactured Metal Bollards" } },
      "32 80": { title: "Irrigation", sub: { "32 82 00": "Irrigation Pumps", "32 84 00": "Planting Irrigation", "32 84 13": "Drip Irrigation", "32 84 23": "Underground Sprinklers" } },
      "32 90": { title: "Planting", sub: { "32 91 00": "Planting Preparation", "32 91 13": "Soil Preparation", "32 91 19": "Landscape Grading", "32 92 00": "Turf and Grasses", "32 92 19": "Seeding", "32 92 23": "Sodding", "32 93 00": "Plants", "32 93 33": "Shrubs", "32 93 43": "Trees", "32 94 00": "Planting Accessories" } }
    }
  },
  "33": {
    title: "Utilities",
    sections: {
      "33 05": { title: "Common Work Results for Utilities", sub: { "33 05 05": "Buried Piping Installation", "33 05 07": "Trenchless Installation of Utility Piping", "33 05 13": "Manholes and Structures", "33 05 61": "Concrete Manholes" } },
      "33 10": { title: "Water Utilities", sub: { "33 11 00": "Groundwater Sources", "33 11 13": "Potable Water Supply Wells", "33 12 00": "Surface Water Sources", "33 14 00": "Water Utility Transmission and Distribution", "33 14 11": "Water Utility Transmission Piping", "33 14 13": "Public Water Utility Distribution Piping", "33 14 19": "Valves and Hydrants for Water Utility Service", "33 16 00": "Water Utility Storage Tanks", "33 19 00": "Water Utility Metering Equipment" } },
      "33 30": { title: "Sanitary Sewerage Utilities", sub: { "33 31 00": "Sanitary Sewerage Piping", "33 31 11": "Public Sanitary Sewerage Gravity Piping", "33 31 23": "Sanitary Sewerage Force Main Piping", "33 32 00": "Sanitary Sewerage Equipment", "33 32 11": "Field-Erected Wastewater Pumping Stations", "33 32 13": "Packaged Wastewater Pumping Stations", "33 34 00": "Onsite Wastewater Disposal", "33 34 13": "Septic Tanks", "33 34 51": "Drainage Field System" } },
      "33 40": { title: "Storm Drainage Utilities", sub: { "33 41 00": "Subdrainage", "33 42 00": "Stormwater Conveyance", "33 42 11": "Stormwater Gravity Piping", "33 42 13": "Stormwater Culverts", "33 42 31": "Stormwater Area Drains and Inlets", "33 44 00": "Stormwater Utility Equipment", "33 46 00": "Stormwater Management", "33 46 11": "Stormwater Ponds", "33 46 23": "Modular Buried Stormwater Storage Units" } },
      "33 50": { title: "Hydrocarbon Utilities", sub: { "33 51 00": "Hydrocarbon Sources", "33 52 00": "Hydrocarbon Transmission and Distribution", "33 56 00": "Hydrocarbon Storage" } },
      "33 60": { title: "Hydronic and Steam Energy Utilities", sub: { "33 61 00": "Hydronic Energy Distribution", "33 63 00": "Steam Energy Distribution" } },
      "33 70": { title: "Electrical Utilities", sub: { "33 71 00": "Electrical Utility Transmission and Distribution", "33 71 13": "Electrical Utility Towers", "33 71 16": "Electrical Poles", "33 71 19": "Electrical Underground Ducts and Manholes", "33 71 73": "Electrical Utility Services", "33 72 00": "Utility Substations", "33 73 00": "Utility Transformers", "33 75 00": "High-Voltage Switchgear", "33 79 00": "Site Grounding" } },
      "33 80": { title: "Communications Utilities", sub: { "33 81 00": "Communications Structures", "33 81 13": "Monopole Communications Towers", "33 82 00": "Communications Transmission and Distribution" } }
    }
  },
  "34": {
    title: "Transportation",
    sections: {
      "34 10": { title: "Guideways/Railways", sub: { "34 11 00": "Rail Tracks", "34 11 13": "Track Rails", "34 11 23": "Special Trackwork", "34 11 33": "Track Cross Ties", "34 12 00": "Monorails", "34 14 00": "Cable Transportation" } },
      "34 20": { title: "Traction Power", sub: { "34 21 00": "Traction Power Distribution", "34 23 00": "Overhead Traction Power", "34 24 00": "Third Rail Traction Power" } },
      "34 40": { title: "Transportation Signaling and Control Equipment", sub: { "34 41 00": "Roadway Signaling and Control Equipment", "34 41 13": "Traffic Signals", "34 42 00": "Railway Signaling and Control Equipment", "34 43 00": "Airfield Signaling and Control Equipment", "34 43 13": "Airfield Signals and Lighting" } },
      "34 50": { title: "Transportation Fare Collection Equipment", sub: { "34 52 00": "Vehicle Fare Collection", "34 54 00": "Passenger Fare Collection" } },
      "34 70": { title: "Transportation Construction and Equipment", sub: { "34 71 00": "Roadway Construction", "34 71 13": "Vehicle Barriers", "34 71 19": "Vehicle Delineators", "34 72 00": "Railway Construction", "34 73 00": "Airfield Construction", "34 75 00": "Roadway Equipment" } },
      "34 80": { title: "Bridges", sub: { "34 81 00": "Bridge Machinery", "34 82 00": "Bridge Specialties" } }
    }
  },
  "35": {
    title: "Waterway and Marine Construction",
    sections: {
      "35 10": { title: "Waterway and Marine Signaling and Control Equipment", sub: { "35 11 00": "Signaling and Control Equipment for Waterways", "35 12 00": "Marine Signaling and Control Equipment", "35 13 00": "Signaling and Control Equipment for Dams" } },
      "35 20": { title: "Waterway and Marine Construction and Equipment", sub: { "35 21 00": "General Fabrications for Waterways", "35 22 00": "Hydraulic Gates", "35 24 00": "Dredging", "35 24 13": "Suction Dredging", "35 24 23": "Clamshell Dredging" } },
      "35 30": { title: "Coastal Construction", sub: { "35 31 00": "Shoreline Protection", "35 31 16": "Seawalls", "35 31 19": "Revetments", "35 31 23": "Breakwaters", "35 31 29": "Groins", "35 32 00": "Artificial Reefs" } },
      "35 40": { title: "Waterway Construction and Equipment", sub: { "35 41 00": "Levees", "35 42 00": "Waterway Bank Protection", "35 43 00": "Waterway Scour Protection", "35 49 00": "Waterway Structures", "35 49 23": "Waterway Locks" } },
      "35 50": { title: "Marine Construction and Equipment", sub: { "35 51 00": "Floating Construction", "35 52 00": "Offshore Platform Construction", "35 53 00": "Underwater Construction", "35 59 00": "Marine Specialties", "35 59 13": "Marine Fenders", "35 59 33": "Marine Bollards and Cleats" } },
      "35 70": { title: "Dam Construction and Equipment", sub: { "35 71 00": "Gravity Dams", "35 72 00": "Arch Dams", "35 73 00": "Embankment Dams", "35 74 00": "Buttress Dams", "35 79 00": "Auxiliary Dam Structures", "35 79 13": "Fish Ladders" } }
    }
  },
  "40": {
    title: "Process Interconnections",
    sections: {
      "40 05": { title: "Common Work Results for Process Integration", sub: { "40 05 13": "Common Work Results for Process Piping", "40 05 23": "Common Work Results for Process Valves", "40 05 53": "Process Valves Four-inch Diameter and Larger", "40 05 61": "Gate Valves" } },
      "40 10": { title: "Gas and Vapor Process Piping", sub: { "40 11 00": "Steam Process Piping", "40 12 00": "Compressed Air Process Piping" } },
      "40 20": { title: "Liquids Process Piping", sub: { "40 21 00": "Liquid Fuel Process Piping", "40 23 00": "Water and Wastewater Process Piping", "40 23 40": "Sanitary Wastewater Process Piping" } },
      "40 40": { title: "Process Piping and Equipment Protection", sub: { "40 41 00": "Process Piping and Equipment Heat Tracing", "40 42 00": "Process Piping and Equipment Insulation" } },
      "40 60": { title: "Process Control and Enterprise Management Systems", sub: { "40 62 00": "Computer System Hardware", "40 63 00": "Control System Equipment", "40 63 43": "Programmable Logic Controllers" } },
      "40 70": { title: "Instrumentation for Process Systems", sub: { "40 71 00": "Flow Measurement", "40 71 13": "Magnetic Flow Meters", "40 72 00": "Level Measurement", "40 73 00": "Pressure, Strain, and Force Measurement" } }
    }
  },
  "41": {
    title: "Material Processing and Handling Equipment",
    sections: {
      "41 10": { title: "Bulk Material Processing Equipment", sub: { "41 12 00": "Bulk Material Conveying Equipment", "41 12 13": "Bulk Material Conveyors", "41 14 00": "Batching Equipment" } },
      "41 20": { title: "Piece Material Handling Equipment", sub: { "41 21 00": "Conveyors", "41 21 23": "Piece Material Conveyors", "41 22 00": "Cranes and Hoists", "41 22 13": "Cranes", "41 22 23": "Hoists" } },
      "41 30": { title: "Manufacturing Equipment", sub: { "41 31 00": "Manufacturing Lines and Equipment", "41 32 00": "Forming Equipment", "41 33 00": "Machining Equipment", "41 36 00": "Assembly and Testing Equipment" } },
      "41 40": { title: "Container Processing and Packaging", sub: { "41 41 00": "Container Filling and Sealing", "41 42 00": "Container Packing Equipment" } },
      "41 50": { title: "Material Storage", sub: { "41 51 00": "Automatic Material Storage", "41 52 00": "Bulk Material Storage", "41 52 16": "Silos" } },
      "41 60": { title: "Mobile Plant Equipment", sub: { "41 61 00": "Mobile Earth Moving Equipment", "41 62 00": "Trucks" } }
    }
  },
  "42": {
    title: "Process Heating, Cooling, and Drying Equipment",
    sections: {
      "42 10": { title: "Process Heating Equipment", sub: { "42 11 00": "Process Boilers", "42 12 00": "Process Heaters", "42 13 00": "Industrial Heat Exchangers", "42 14 00": "Industrial Furnaces" } },
      "42 20": { title: "Process Cooling Equipment", sub: { "42 21 00": "Process Cooling Towers", "42 22 00": "Process Chillers and Coolers" } },
      "42 30": { title: "Process Drying Equipment", sub: { "42 32 00": "Material Dryers" } }
    }
  },
  "43": {
    title: "Process Gas and Liquid Handling Equipment",
    sections: {
      "43 10": { title: "Gas Handling Equipment", sub: { "43 11 00": "Gas Fans, Blowers, Pumps and Boosters", "43 12 00": "Gas Compressors", "43 13 00": "Gas Process Equipment" } },
      "43 20": { title: "Liquid Handling Equipment", sub: { "43 23 00": "Dry Location Liquid Pumps", "43 23 13": "Overhung Horizontal Centrifugal Pumps", "43 24 00": "Suspended Liquid Pumps", "43 25 00": "Submersible Liquid Pumps" } },
      "43 30": { title: "Gas and Liquid Purification Equipment", sub: { "43 31 00": "Filtration Equipment", "43 32 00": "Purification Process Equipment" } },
      "43 40": { title: "Gas and Liquid Storage", sub: { "43 41 00": "Non-pressurized Tanks and Vessels", "43 42 00": "Pressurized Tanks and Vessels" } }
    }
  },
  "44": {
    title: "Pollution and Waste Control Equipment",
    sections: {
      "44 10": { title: "Air Pollution Control", sub: { "44 11 00": "Particulate Control Equipment", "44 13 00": "Gaseous Air Pollution Control Equipment" } },
      "44 40": { title: "Water Pollution Control Equipment", sub: { "44 41 00": "Water Pollution Containment and Cleanup" } },
      "44 50": { title: "Solid Waste Control and Reuse", sub: { "44 51 00": "Solid Waste Collection and Transfer", "44 53 00": "Solid Waste Processing Equipment", "44 53 61": "Solid Waste Compactors" } },
      "44 60": { title: "Waste Thermal Processing Equipment", sub: { "44 61 00": "Waste-to-Energy Plants", "44 64 00": "Gasification Equipment" } }
    }
  },
  "45": {
    title: "Industry-Specific Manufacturing Equipment",
    sections: {
      "45 11": { title: "Oil and Gas Extraction Equipment", sub: { "45 11 01": "Operation and Maintenance" } },
      "45 13": { title: "Mining Machinery and Equipment", sub: { "45 13 01": "Operation and Maintenance" } },
      "45 15": { title: "Food Manufacturing Equipment", sub: { "45 15 01": "Operation and Maintenance" } },
      "45 19": { title: "Textiles and Apparel Manufacturing Equipment", sub: { "45 19 01": "Operation and Maintenance" } },
      "45 43": { title: "Computer and Electronic Product Manufacturing Equipment", sub: { "45 43 01": "Operation and Maintenance" } }
    }
  },
  "46": {
    title: "Water and Wastewater Equipment",
    sections: {
      "46 07": { title: "Packaged Water and Wastewater Treatment Equipment", sub: { "46 07 13": "Packaged Water Treatment Equipment", "46 07 53": "Packaged Wastewater Treatment Equipment" } },
      "46 20": { title: "Preliminary Treatment Equipment", sub: { "46 21 00": "Screening Equipment", "46 23 00": "Grit Removal and Handling Equipment", "46 24 00": "Grinding and Shredding Equipment", "46 25 00": "Oil and Grease Separation" } },
      "46 30": { title: "Chemical Feed Equipment", sub: { "46 31 00": "Gas Chemical Feed Equipment", "46 33 00": "Liquid Chemical Feed Equipment", "46 36 00": "Dry Chemical Feed Equipment" } },
      "46 40": { title: "Clarification and Mixing Equipment", sub: { "46 41 00": "Mixing Equipment", "46 43 00": "Clarifier Equipment" } },
      "46 50": { title: "Secondary Treatment Equipment", sub: { "46 51 00": "Air and Gas Diffusion Equipment", "46 53 00": "Biological Treatment Systems" } },
      "46 60": { title: "Advanced Treatment Equipment", sub: { "46 61 00": "Filtration Equipment", "46 63 00": "Demineralization Equipment", "46 66 00": "Ultraviolet Equipment" } },
      "46 70": { title: "Residuals Handling and Treatment", sub: { "46 71 00": "Residuals Thickening Equipment", "46 73 00": "Residuals Stabilization", "46 76 00": "Residuals Dewatering Equipment" } }
    }
  },
  "48": {
    title: "Electrical Power Generation",
    sections: {
      "48 10": { title: "Electrical Power Generation Equipment", sub: { "48 11 00": "Fossil Fuel Plant Electrical Power Generation", "48 12 00": "Nuclear Fuel Plant Electrical Power Generation", "48 13 00": "Hydroelectric Plant Electrical Power Generation", "48 14 00": "Solar Energy Electrical Power Generation", "48 15 00": "Wind Energy Electrical Power Generation" } },
      "48 70": { title: "Electrical Power Generation Testing", sub: { "48 71 00": "Electrical Power Generation Test Equipment" } }
    }
  }
};

const App = () => {
  const [csiData] = useState(INITIAL_DATA);
  const [projectInfo, setProjectInfo] = useState({
    name: 'New Project',
    location: '',
    engineer: '',
    bidDueDate: '',
  });

  const [bidItems, setBidItems] = useState([]);
  
  // Selection State
  const [selectedDiv, setSelectedDiv] = useState("");
  const [selectedSec, setSelectedSec] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [decimalCode, setDecimalCode] = useState(""); 
  const [customTitle, setCustomTitle] = useState("");
  const [drawingRef, setDrawingRef] = useState(""); 

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCostColumnsVisible, setIsCostColumnsVisible] = useState(true); 

  // File Upload Ref
  const fileInputRef = useRef(null);

  // --- Search Logic ---
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const results = [];
    const query = searchQuery.toLowerCase();

    Object.keys(csiData).forEach(divCode => {
      const division = csiData[divCode];
      
      // Check Division
      if (divCode.includes(query) || division.title.toLowerCase().includes(query)) {
        // We generally don't add just the division as an item, but we could.
      }

      Object.keys(division.sections).forEach(secCode => {
        const section = division.sections[secCode];
        
        // Check Section
        if (secCode.includes(query) || section.title.toLowerCase().includes(query)) {
           results.push({
             code: secCode,
             title: section.title,
             divCode,
             secCode,
             subCode: ''
           });
        }

        Object.entries(section.sub).forEach(([subCode, subTitle]) => {
           // Check Subsection
           if (subCode.includes(query) || subTitle.toLowerCase().includes(query)) {
             results.push({
               code: subCode,
               title: subTitle,
               divCode,
               secCode,
               subCode
             });
           }
        });
      });
    });
    return results.slice(0, 50); // Limit results for performance
  }, [searchQuery, csiData]);


  // --- Hierarchy Logic ---
  const divisions = useMemo(() => Object.keys(csiData).sort(), [csiData]);

  const sections = useMemo(() => {
    if (!selectedDiv || !csiData[selectedDiv]) return [];
    return Object.keys(csiData[selectedDiv].sections).sort();
  }, [selectedDiv, csiData]);

  const subsections = useMemo(() => {
    if (!selectedDiv || !selectedSec || !csiData[selectedDiv]?.sections[selectedSec]) return [];
    return Object.entries(csiData[selectedDiv].sections[selectedSec].sub).sort((a, b) => a[0].localeCompare(b[0]));
  }, [selectedDiv, selectedSec, csiData]);

  const handleDivChange = (e) => {
    setSelectedDiv(e.target.value);
    setSelectedSec("");
    setSelectedSub("");
    setCustomTitle("");
    setDecimalCode("");
  };

  const handleSecChange = (e) => {
    setSelectedSec(e.target.value);
    setSelectedSub("");
    setCustomTitle("");
  };

  const handleSubChange = (e) => {
    const code = e.target.value;
    setSelectedSub(code);
    if (code && selectedDiv && selectedSec) {
      const title = csiData[selectedDiv].sections[selectedSec].sub[code];
      setCustomTitle(title);
    }
  };

  const selectSearchResult = (res) => {
    // Populate the dropdowns based on the search result
    setSelectedDiv(res.divCode);
    setSelectedSec(res.secCode);
    setSelectedSub(res.subCode);
    setCustomTitle(res.title);
    setSearchQuery(""); // Clear search
    setIsSearchActive(false); // Switch back to browser
  };

  const addItem = () => {
    if (!customTitle) return;

    let finalCode = selectedSub || selectedSec || selectedDiv || "00 00 00";
    if (decimalCode) {
      finalCode = `${finalCode}.${decimalCode}`;
    }

    const newItem = {
      id: Date.now(),
      code: finalCode,
      title: customTitle,
      description: '',
      dwgRef: drawingRef, 
      quantity: 0,
      unit: 'LS', 
      labor: '',     
      material: '',  
      equipment: '', 
      division: selectedDiv ? `${selectedDiv} ${csiData[selectedDiv].title}` : '',
      section: selectedSec && csiData[selectedDiv]?.sections[selectedSec] ? `${selectedSec} ${csiData[selectedDiv].sections[selectedSec].title}` : ''
    };

    setBidItems([...bidItems, newItem]);
    // Optional: Reset basic fields but keep location in tree
    setDrawingRef("");
  };

  const updateBidItem = (id, field, value) => {
    setBidItems(bidItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeBidItem = (id) => {
    setBidItems(bidItems.filter((item) => item.id !== id));
  };

  const exportToCSV = () => {
    let csvContent = `Project Name:,${projectInfo.name}\n`;
    csvContent += `Location:,${projectInfo.location}\n`;
    csvContent += `Construction Engineer:,${projectInfo.engineer}\n`;
    csvContent += `Bid Due Date:,${projectInfo.bidDueDate}\n\n`;
    csvContent += `Division,Section,CSI Code,Drawing Ref,Item Title,Specific Description / Scope,Quantity,Unit,Labor (Unit),Material (Unit),Equipment (Unit),Total Unit Price,Total Line Item\n`;

    bidItems.forEach((item) => {
      const cleanDesc = `"${item.description.replace(/"/g, '""')}"`;
      const cleanTitle = `"${item.title}"`;
      const cleanDiv = `"${item.division}"`;
      const cleanSec = `"${item.section}"`;
      const cleanRef = `"${item.dwgRef || ''}"`;
      
      const l = parseFloat(item.labor) || 0;
      const m = parseFloat(item.material) || 0;
      const e = parseFloat(item.equipment) || 0;
      const totalUnit = l + m + e;
      const totalLine = totalUnit * (parseFloat(item.quantity) || 0);

      csvContent += `${cleanDiv},${cleanSec},${item.code},${cleanRef},${cleanTitle},${cleanDesc},${item.quantity},${item.unit},${item.labor},${item.material},${item.equipment},${totalUnit || ''},${totalLine || ''}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${projectInfo.name.replace(/\s+/g, '_') || 'Bid_Sheet'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- IMPORT FUNCTIONALITY ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      processImportCSV(text);
    };
    reader.readAsText(file);
    // Reset file input so same file can be uploaded again if needed
    e.target.value = '';
  };

  const processImportCSV = (csvText) => {
    try {
      const lines = csvText.split('\n');
      const newProjectInfo = { ...projectInfo };
      const newBidItems = [];

      // Parse Headers (Project Info)
      lines.forEach((line, index) => {
        if (index < 5) {
          const parts = line.split(',');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(',').trim();
            
            if (key.includes('Project Name')) newProjectInfo.name = val;
            if (key.includes('Location')) newProjectInfo.location = val;
            if (key.includes('Construction Engineer')) newProjectInfo.engineer = val;
            if (key.includes('Bid Due Date')) newProjectInfo.bidDueDate = val;
          }
        }
      });

      // Parse Data Rows
      let dataStartIndex = -1;
      for(let i=0; i<lines.length; i++) {
        if (lines[i].startsWith('Division,Section,CSI Code')) {
          dataStartIndex = i + 1;
          break;
        }
      }

      if (dataStartIndex !== -1) {
        for (let i = dataStartIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // CSV Split logic handling quoted commas
          const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          
          if (parts.length >= 8) {
            const clean = (str) => str ? str.replace(/^"|"$/g, '').replace(/""/g, '"') : '';

            newBidItems.push({
              id: Date.now() + i,
              division: clean(parts[0]),
              section: clean(parts[1]),
              code: clean(parts[2]),
              dwgRef: clean(parts[3]),
              title: clean(parts[4]),
              description: clean(parts[5]),
              quantity: parseFloat(parts[6]) || 0,
              unit: clean(parts[7]),
              labor: parts[8] || '',
              material: parts[9] || '',
              equipment: parts[10] || ''
            });
          }
        }
      }

      setProjectInfo(newProjectInfo);
      setBidItems(newBidItems);
      alert(`Import Successful! Loaded ${newBidItems.length} items.`);
    } catch (error) {
      console.error("Import Error:", error);
      alert("Error importing file. Please ensure it is a valid CSV generated by this tool.");
    }
  };

  // Helper to calculate row total
  const getRowTotal = (item) => {
    const l = parseFloat(item.labor) || 0;
    const m = parseFloat(item.material) || 0;
    const e = parseFloat(item.equipment) || 0;
    return (l + m + e).toFixed(2);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans text-sm text-gray-900 overflow-hidden">
      
      {/* 1. TOP TOOLBAR */}
      <div className="bg-[#217346] text-white px-4 py-2 flex justify-between items-center shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-[#10442a] rounded transition-colors mr-2"
            title="Toggle Code Selector"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          
          <FileSpreadsheet className="h-5 w-5" />
          <span className="font-semibold tracking-wide">CSI Bid Generator</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Hidden File Input */}
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            className="hidden"
            onChange={handleFileUpload}
          />
          
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-[#185534] hover:bg-[#0e3b23] text-white px-4 py-1.5 text-xs font-semibold rounded-sm border border-[#3e8e5e] flex items-center gap-2 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import Project
          </button>

          <button
            onClick={exportToCSV}
            className="bg-[#10442a] hover:bg-[#0a2e1c] text-white px-4 py-1.5 text-xs font-semibold rounded-sm border border-[#3e8e5e] flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Bid Sheet
          </button>
        </div>
      </div>

      {/* 2. PROJECT PROPERTIES BAR */}
      <div className="bg-white border-b border-gray-300 p-2 grid grid-cols-4 gap-4 text-xs shrink-0">
        <div className="flex flex-col">
          <label className="text-gray-500 font-semibold mb-1">Project Name</label>
          <input 
            className="border border-gray-300 p-1 focus:border-[#217346] outline-none" 
            value={projectInfo.name}
            onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-500 font-semibold mb-1">Location</label>
          <input 
            className="border border-gray-300 p-1 focus:border-[#217346] outline-none"
            value={projectInfo.location}
            onChange={(e) => setProjectInfo({...projectInfo, location: e.target.value})}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-500 font-semibold mb-1">Construction Engineer</label>
          <input 
            className="border border-gray-300 p-1 focus:border-[#217346] outline-none"
            value={projectInfo.engineer}
            onChange={(e) => setProjectInfo({...projectInfo, engineer: e.target.value})}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-500 font-semibold mb-1">Bid Due Date</label>
          <input 
            type="date"
            className="border border-gray-300 p-1 focus:border-[#217346] outline-none"
            value={projectInfo.bidDueDate}
            onChange={(e) => setProjectInfo({...projectInfo, bidDueDate: e.target.value})}
          />
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: SELECTOR & SEARCH (COLLAPSIBLE) */}
        {isSidebarOpen && (
          <div className="w-80 bg-gray-50 border-r border-gray-300 flex flex-col shrink-0 transition-all duration-300">
            
            {/* Toggle Header */}
            <div className="p-2 bg-gray-200 border-b border-gray-300 font-bold text-gray-700 text-xs uppercase flex justify-between items-center">
              <span>Code Selector</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsSearchActive(false)}
                  className={`px-2 py-0.5 rounded text-[10px] ${!isSearchActive ? 'bg-white text-[#217346] shadow-sm' : 'text-gray-500'}`}
                >
                  Browse
                </button>
                <button 
                  onClick={() => setIsSearchActive(true)}
                  className={`px-2 py-0.5 rounded text-[10px] ${isSearchActive ? 'bg-white text-[#217346] shadow-sm' : 'text-gray-500'}`}
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              
              {/* SEARCH VIEW */}
              {isSearchActive ? (
                <div className="space-y-3 h-full flex flex-col">
                  <div className="relative">
                    <input 
                      className="w-full border border-gray-400 p-2 pl-8 text-xs bg-white focus:outline-none focus:border-[#217346]"
                      placeholder="Search codes or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-2.5 hover:text-red-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto border border-gray-200 bg-white rounded-sm">
                    {searchQuery.length < 2 ? (
                       <div className="p-4 text-center text-gray-400 text-xs italic">
                         Type at least 2 characters...
                       </div>
                    ) : searchResults.length === 0 ? (
                       <div className="p-4 text-center text-gray-400 text-xs italic">
                         No results found.
                       </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map((res) => (
                          <button
                            key={res.code}
                            onClick={() => selectSearchResult(res)}
                            className="w-full text-left p-2 hover:bg-blue-50 text-xs group"
                          >
                            <div className="font-bold text-[#217346]">{res.code}</div>
                            <div className="text-gray-600 truncate">{res.title}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // BROWSE VIEW (Dropdowns)
                <>
                  {/* Division */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">1. Division</label>
                    <div className="relative">
                      <select 
                        className="w-full border border-gray-400 p-1.5 pr-6 text-xs bg-white focus:outline-none focus:border-[#217346] appearance-none"
                        value={selectedDiv}
                        onChange={handleDivChange}
                      >
                        <option value="">Select...</option>
                        {divisions.map(div => (
                          <option key={div} value={div}>{div} - {csiData[div].title}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3 w-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Section */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">2. Section</label>
                    <div className="relative">
                      <select 
                        className="w-full border border-gray-400 p-1.5 pr-6 text-xs bg-white focus:outline-none focus:border-[#217346] disabled:bg-gray-100 disabled:text-gray-400 appearance-none"
                        value={selectedSec}
                        onChange={handleSecChange}
                        disabled={!selectedDiv}
                      >
                        <option value="">Select...</option>
                        {sections.map(sec => (
                          <option key={sec} value={sec}>{sec} - {csiData[selectedDiv].sections[sec].title}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3 w-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Subsection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">3. Subsection</label>
                    <div className="relative">
                      <select 
                        className="w-full border border-gray-400 p-1.5 pr-6 text-xs bg-white focus:outline-none focus:border-[#217346] disabled:bg-gray-100 disabled:text-gray-400 appearance-none"
                        value={selectedSub}
                        onChange={handleSubChange}
                        disabled={!selectedSec}
                      >
                        <option value="">Select...</option>
                        {subsections.map(([code, title]) => (
                          <option key={code} value={code}>{code} - {title}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3 w-3 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Decimal */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">4. Decimal (Optional)</label>
                    <div className="flex items-center">
                      <span className="bg-gray-200 border border-r-0 border-gray-400 p-1.5 text-xs text-gray-600">.</span>
                      <input 
                        type="text"
                        className="w-full border border-gray-400 p-1.5 text-xs bg-white focus:outline-none focus:border-[#217346] disabled:bg-gray-100"
                        placeholder="16"
                        value={decimalCode}
                        onChange={(e) => setDecimalCode(e.target.value.replace(/[^0-9]/g, ''))}
                        disabled={!selectedSub}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Title Override - Always visible at bottom */}
              <div className={`pt-2 border-t border-gray-300 mt-2 ${isSearchActive ? 'bg-gray-50' : ''}`}>
                 <label className="block text-xs font-bold text-gray-600 mb-1">Item Title</label>
                 <input 
                    className="w-full border border-gray-400 p-1.5 text-xs bg-white focus:outline-none focus:border-[#217346]"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Selected Item Title"
                  />
              </div>

              <div className="pt-2">
                 <label className="block text-xs font-bold text-gray-600 mb-1">Dwg Ref (Optional)</label>
                 <input 
                    className="w-full border border-gray-400 p-1.5 text-xs bg-white focus:outline-none focus:border-[#217346]"
                    value={drawingRef}
                    onChange={(e) => setDrawingRef(e.target.value)}
                    placeholder="e.g. A-101"
                  />
              </div>

              <button 
                onClick={addItem}
                disabled={!customTitle}
                className="w-full bg-gray-200 border border-gray-400 text-gray-800 py-2 font-bold text-xs hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 flex justify-center items-center gap-1 mt-2"
              >
                <Plus className="h-3 w-3" />
                INSERT ITEM
              </button>
            </div>
          </div>
        )}

        {/* RIGHT PANEL: SPREADSHEET GRID */}
        <div className="flex-1 bg-white overflow-auto relative">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="border border-gray-300 px-2 py-1.5 text-left w-24 font-semibold text-gray-600 bg-white">CSI Code</th>
                <th className="border border-gray-300 px-2 py-1.5 text-left w-16 font-semibold text-gray-600 bg-white">Ref</th>
                <th className="border border-gray-300 px-2 py-1.5 text-left w-48 font-semibold text-gray-600 bg-white">Title</th>
                <th className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-600 bg-white">Description / Scope</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center w-16 font-semibold text-gray-600 bg-white">Qty</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center w-16 font-semibold text-gray-600 bg-white">Unit</th>
                
                {/* Contractor Section - Blue Headers - Collapsible */}
                {isCostColumnsVisible ? (
                  <>
                    <th className="border border-gray-300 px-2 py-1.5 text-center w-20 font-bold text-blue-800 bg-blue-100 border-b-blue-300">Labor ($)</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center w-20 font-bold text-blue-800 bg-blue-100 border-b-blue-300">Mat. ($)</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center w-20 font-bold text-blue-800 bg-blue-100 border-b-blue-300">Equip. ($)</th>
                    
                    {/* Total - Gray Header - Collapsible */}
                    <th className="border border-gray-300 px-2 py-1.5 text-center w-24 font-bold text-gray-700 bg-gray-200">
                        <div className="flex items-center justify-between">
                            <span>Total ($)</span>
                            <button 
                                onClick={() => setIsCostColumnsVisible(false)}
                                className="p-0.5 hover:bg-gray-300 rounded text-gray-600"
                                title="Hide Cost Columns"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </th>
                  </>
                ) : (
                  <th className="border border-gray-300 px-1 py-1.5 text-center w-8 bg-gray-50 border-l-4 border-l-blue-200 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setIsCostColumnsVisible(true)} title="Show Costs">
                      <div className="flex flex-col items-center justify-center gap-1 h-full text-blue-800 font-bold">
                          <ChevronLeft className="h-4 w-4" />
                          <span className="text-[10px] [writing-mode:vertical-lr] rotate-180">COSTS</span>
                      </div>
                  </th>
                )}
                
                <th className="border border-gray-300 px-2 py-1.5 w-10 bg-white"></th>
              </tr>
            </thead>
            <tbody>
              {bidItems.length === 0 && (
                <tr>
                  <td colSpan={isCostColumnsVisible ? 11 : 8} className="p-12 text-center text-gray-400 italic">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 opacity-20" />
                      <p>Use the <strong>Search</strong> tab on the left to find codes instantly.</p>
                      <p className="text-xs opacity-70">Example: Type "Concrete" or "Door"</p>
                    </div>
                  </td>
                </tr>
              )}
              {bidItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1 bg-white font-mono text-gray-700 whitespace-nowrap text-[11px]">
                    {item.code}
                  </td>
                  <td className="border border-gray-300 p-0 bg-white">
                    <input
                      className="w-full h-full px-2 py-1.5 border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent text-gray-600"
                      value={item.dwgRef || ''}
                      onChange={(e) => updateBidItem(item.id, 'dwgRef', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1 font-medium text-gray-800 bg-white">
                    {item.title}
                  </td>
                  <td className="border border-gray-300 p-0 bg-white">
                    <input
                      className="w-full h-full px-2 py-1.5 border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent"
                      placeholder="Enter scope..."
                      value={item.description}
                      onChange={(e) => updateBidItem(item.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0 bg-white">
                    <input
                      type="number"
                      className="w-full h-full px-2 py-1.5 text-center border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent"
                      value={item.quantity}
                      onChange={(e) => updateBidItem(item.id, 'quantity', e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0 bg-white">
                     <select
                        className="w-full h-full px-1 py-1 text-center border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent cursor-pointer appearance-none"
                        value={item.unit}
                        onChange={(e) => updateBidItem(item.id, 'unit', e.target.value)}
                      >
                        <option value="LS">LS</option>
                        <option value="SF">SF</option>
                        <option value="LF">LF</option>
                        <option value="CY">CY</option>
                        <option value="EA">EA</option>
                        <option value="HR">HR</option>
                        <option value="TN">TN</option>
                      </select>
                  </td>
                  
                  {/* Contractor Inputs - Distinct Blue Background - Collapsible */}
                  {isCostColumnsVisible ? (
                    <>
                      <td className="border border-gray-300 p-0 bg-blue-50">
                        <input
                          type="number"
                          className="w-full h-full px-2 py-1.5 text-right border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent text-blue-900 font-mono font-medium"
                          placeholder="0.00"
                          value={item.labor}
                          onChange={(e) => updateBidItem(item.id, 'labor', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-300 p-0 bg-blue-50">
                        <input
                          type="number"
                          className="w-full h-full px-2 py-1.5 text-right border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent text-blue-900 font-mono font-medium"
                          placeholder="0.00"
                          value={item.material}
                          onChange={(e) => updateBidItem(item.id, 'material', e.target.value)}
                        />
                      </td>
                      <td className="border border-gray-300 p-0 bg-blue-50">
                        <input
                          type="number"
                          className="w-full h-full px-2 py-1.5 text-right border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-transparent text-blue-900 font-mono font-medium"
                          placeholder="0.00"
                          value={item.equipment}
                          onChange={(e) => updateBidItem(item.id, 'equipment', e.target.value)}
                        />
                      </td>

                      {/* Calculated Total - Read Only Gray */}
                      <td className="border border-gray-300 px-2 py-1 text-right font-mono font-bold text-gray-700 bg-gray-100">
                        {getRowTotal(item)}
                      </td>
                    </>
                  ) : (
                      <td className="border border-gray-300 bg-gray-50 border-l-4 border-l-blue-200"></td>
                  )}

                  <td className="border border-gray-300 px-1 text-center bg-white">
                    <button 
                      onClick={() => removeBidItem(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
const root = createRoot(document.getElementById('root'));
root.render(<App />);
