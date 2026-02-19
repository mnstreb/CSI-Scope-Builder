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
// Populated with Divisions 00-48 from user specifications
// ==========================================
const INITIAL_DATA = {
  "00": {
    title: "Procurement and Contracting Requirements",
    sections: {
      "00 10": { title: "Solicitation", sub: { "00 11 00": "Advertisements and Invitations", "00 11 13": "Advertisement for Bids", "00 11 16": "Invitation to Bid", "00 11 19": "Request for Proposal", "00 11 53": "Request for Qualifications" } },
      "00 20": { title: "Instructions for Procurement", sub: { "00 21 00": "Instructions", "00 21 13": "Instructions to Bidders", "00 21 16": "Instructions to Proposers", "00 22 00": "Supplementary Instructions", "00 24 00": "Procurement Scopes", "00 24 13": "Scopes of Bids", "00 24 13.13": "Scopes of Bids (Multiple Contracts)", "00 24 13.16": "Scopes of Bids (Multiple-Prime Contract)", "00 26 00": "Procurement Substitution Procedures" } },
      "00 30": { title: "Available Information", sub: { "00 31 00": "Available Project Information", "00 31 13": "Preliminary Schedules", "00 31 13.13": "Preliminary Project Schedule", "00 31 13.16": "Preliminary Construction Schedule", "00 31 19": "Existing Condition Information", "00 31 21": "Survey Information", "00 31 24": "Environmental Assessment Information", "00 31 26": "Existing Hazardous Material Information", "00 31 32": "Geotechnical Data", "00 31 43": "Permit Application" } },
      "00 40": { title: "Procurement Forms and Supplements", sub: { "00 41 00": "Bid Forms", "00 41 13": "Bid Form - Stipulated Sum", "00 41 43": "Bid Form - Unit Price", "00 42 00": "Proposal Forms", "00 43 00": "Procurement Form Supplements", "00 43 13": "Bid Security Form", "00 43 21": "Allowance Form", "00 43 22": "Unit Prices Form", "00 43 23": "Alternates Form", "00 43 36": "Proposed Subcontractors Form", "00 43 43": "Wage Rates Form", "00 43 73": "Proposed Schedule of Values Form", "00 45 00": "Representations and Certifications", "00 45 13": "Bidder's Qualifications", "00 45 19": "Non-Collusion Affidavit" } },
      "00 50": { title: "Contracting Forms and Supplements", sub: { "00 51 00": "Notice of Award", "00 52 00": "Agreement Forms", "00 52 13": "Agreement Form - Stipulated Sum", "00 52 23": "Agreement Form - Construction Manager as Agent", "00 52 33": "Agreement Form - Construction Manager at Risk", "00 52 53": "Agreement Form - Owner-Design/Builder", "00 54 00": "Agreement Form Supplements", "00 55 00": "Notice to Proceed" } },
      "00 60": { title: "Project Forms", sub: { "00 61 00": "Bond Forms", "00 61 13": "Performance and Payment Bond Form", "00 62 00": "Certificates and Other Forms", "00 62 16": "Certificate of Insurance Form", "00 62 76": "Application for Payment Form", "00 63 00": "Clarification and Modification Forms", "00 63 13": "Requests for Information Form", "00 63 57": "Change Order Request Form", "00 63 63": "Change Order Form", "00 65 00": "Closeout Forms", "00 65 16": "Certificate of Substantial Completion Form", "00 65 19": "Certificate of Completion Form", "00 65 36": "Warranty Form" } },
      "00 70": { title: "Conditions of the Contract", sub: { "00 72 00": "General Conditions", "00 73 00": "Supplementary Conditions", "00 73 16": "Insurance Requirements", "00 73 19": "Health and Safety Requirements", "00 73 43": "Wage Rate Requirements" } }
    }
  },
  "01": {
    title: "General Requirements",
    sections: {
      "01 10": { title: "Summary", sub: { "01 11 00": "Summary of Work", "01 12 00": "Multiple Contract Summary", "01 14 00": "Work Restrictions", "01 18 00": "Project Utility Sources" } },
      "01 20": { title: "Price and Payment Procedures", sub: { "01 21 00": "Allowances", "01 22 00": "Unit Prices", "01 23 00": "Alternates", "01 25 00": "Substitution Procedures", "01 26 00": "Contract Modification Procedures", "01 29 00": "Payment Procedures" } },
      "01 30": { title: "Administrative Requirements", sub: { "01 31 00": "Project Management and Coordination", "01 31 19": "Project Meetings", "01 32 00": "Construction Progress Documentation", "01 32 16": "Construction Progress Schedule", "01 32 33": "Photographic Documentation", "01 33 00": "Submittal Procedures", "01 35 00": "Special Procedures" } },
      "01 40": { title: "Quality Requirements", sub: { "01 41 00": "Regulatory Requirements", "01 42 00": "References", "01 43 00": "Quality Assurance", "01 45 00": "Quality Control", "01 45 29": "Testing Laboratory Services" } },
      "01 50": { title: "Temporary Facilities and Controls", sub: { "01 51 00": "Temporary Utilities", "01 52 00": "Construction Facilities", "01 54 00": "Construction Aids", "01 55 00": "Vehicular Access and Parking", "01 56 00": "Temporary Barriers and Enclosures", "01 57 00": "Temporary Controls", "01 57 13": "Temporary Erosion and Sediment Control" } },
      "01 60": { title: "Product Requirements", sub: { "01 61 00": "Common Product Requirements", "01 62 00": "Product Options", "01 64 00": "Owner-Furnished Products", "01 65 00": "Product Delivery Requirements", "01 66 00": "Product Storage and Handling Requirements" } },
      "01 70": { title: "Execution and Closeout Requirements", sub: { "01 71 00": "Examination and Preparation", "01 71 23": "Field Engineering", "01 73 00": "Execution", "01 74 00": "Cleaning and Waste Management", "01 74 19": "Construction Waste Management and Disposal", "01 75 00": "Starting and Adjusting", "01 77 00": "Closeout Procedures", "01 78 00": "Closeout Submittals", "01 78 23": "Operation and Maintenance Data", "01 78 39": "Project Record Documents", "01 79 00": "Demonstration and Training" } },
      "01 80": { title: "Performance Requirements", sub: { "01 81 00": "Facility Performance Requirements", "01 81 13": "Sustainable Design Requirements", "01 91 00": "Commissioning" } }
    }
  },
  "02": {
    title: "Existing Conditions",
    sections: {
      "02 20": { title: "Assessment", sub: { "02 21 00": "Surveys", "02 22 00": "Existing Conditions Assessment", "02 24 00": "Environmental Assessment", "02 26 00": "Hazardous Material Assessment" } },
      "02 30": { title: "Subsurface Investigation", sub: { "02 32 00": "Geotechnical Investigations", "02 32 13": "Subsurface Drilling and Sampling" } },
      "02 40": { title: "Demolition and Structure Moving", sub: { "02 41 00": "Demolition", "02 41 13": "Selective Site Demolition", "02 41 16": "Structure Demolition", "02 41 19": "Selective Demolition", "02 42 00": "Removal and Diversion of Construction Materials", "02 43 00": "Structure Moving" } },
      "02 50": { title: "Site Remediation", sub: { "02 51 00": "Physical Decontamination", "02 55 00": "Remediation Soil Stabilization", "02 56 00": "Site Containment" } },
      "02 60": { title: "Contaminated Site Material Removal", sub: { "02 61 00": "Removal and Disposal of Contaminated Soils", "02 65 00": "Underground Storage Tank Removal" } },
      "02 80": { title: "Facility Remediation", sub: { "02 81 00": "Transportation and Disposal of Hazardous Materials", "02 82 00": "Asbestos Remediation", "02 82 13": "Asbestos Abatement", "02 83 00": "Lead Remediation", "02 83 19": "Lead-Based Paint Remediation", "02 84 00": "Polychlorinate Biphenyl Remediation", "02 87 00": "Biohazard Remediation", "02 87 13": "Mold Remediation" } }
    }
  },
  "03": {
    title: "Concrete",
    sections: {
      "03 00": { title: "General Concrete", sub: { "03 01 00": "Maintenance of Concrete", "03 05 00": "Common Work Results for Concrete", "03 06 00": "Schedules for Concrete", "03 08 00": "Commissioning of Concrete" } },
      "03 10": { title: "Concrete Forming and Accessories", sub: { "03 10 00": "Concrete Forming and Accessories", "03 11 00": "Concrete Forming", "03 15 00": "Concrete Accessories" } },
      "03 20": { title: "Concrete Reinforcing", sub: { "03 20 00": "Concrete Reinforcing", "03 21 00": "Reinforcement Bars", "03 22 00": "Fabric and Grid Reinforcing", "03 23 00": "Stressed Tendon Reinforcing", "03 24 00": "Fibrous Reinforcing", "03 25 00": "Composite Reinforcing" } },
      "03 30": { title: "Cast-in-Place Concrete", sub: { "03 30 00": "Cast-in-Place Concrete", "03 31 00": "Structural Concrete", "03 33 00": "Architectural Concrete", "03 34 00": "Low Density Concrete", "03 35 00": "Concrete Finishing", "03 37 00": "Specialty Placed Concrete", "03 38 00": "Post-Tensioned Concrete", "03 39 00": "Concrete Curing" } },
      "03 40": { title: "Precast Concrete", sub: { "03 40 00": "Precast Concrete", "03 41 00": "Precast Structural Concrete", "03 45 00": "Precast Architectural Concrete", "03 47 00": "Site-Cast Concrete", "03 48 00": "Precast Concrete Specialties", "03 49 00": "Glass-Fiber-Reinforced Concrete" } },
      "03 50": { title: "Cast Decks and Underlayment", sub: { "03 50 00": "Cast Decks and Underlayment", "03 51 00": "Cast Roof Decks", "03 52 00": "Lightweight Concrete Roof Insulation", "03 53 00": "Concrete Topping", "03 54 00": "Cast Underlayment" } },
      "03 60": { title: "Grouting", sub: { "03 60 00": "Grouting", "03 61 00": "Cementitious Grouting", "03 62 00": "Non-Shrink Grouting", "03 63 00": "Epoxy Grouting", "03 64 00": "Injection Grouting" } },
      "03 70": { title: "Mass Concrete", sub: { "03 70 00": "Mass Concrete", "03 71 00": "Mass Concrete for Raft Foundations", "03 72 00": "Mass Concrete for Dams" } },
      "03 80": { title: "Concrete Cutting and Boring", sub: { "03 80 00": "Concrete Cutting and Boring", "03 81 00": "Concrete Cutting", "03 82 00": "Concrete Boring" } }
    }
  },
  "04": {
    title: "Masonry",
    sections: {
      "04 00": { title: "General Masonry", sub: { "04 01 00": "Maintenance of Masonry", "04 05 00": "Common Work Results for Masonry", "04 06 00": "Schedules for Masonry", "04 08 00": "Commissioning of Masonry" } },
      "04 20": { title: "Unit Masonry", sub: { "04 20 00": "Unit Masonry", "04 21 00": "Clay Unit Masonry", "04 22 00": "Concrete Unit Masonry", "04 22 00.13": "Concrete Unit Veneer Masonry", "04 22 00.16": "Surface-Bonded Concrete Unit Masonry", "04 23 00": "Glass Unit Masonry", "04 24 00": "Adobe Unit Masonry", "04 25 00": "Unit Masonry Panels", "04 26 00": "Single-Wythe Unit Masonry", "04 27 00": "Multiple-Wythe Unit Masonry", "04 28 00": "Concrete Form Masonry Units", "04 29 00": "Engineered Unit Masonry" } },
      "04 40": { title: "Stone Assemblies", sub: { "04 40 00": "Stone Assemblies", "04 41 00": "Dry-Placed Stone", "04 42 00": "Exterior Stone Cladding", "04 43 00": "Stone Masonry" } },
      "04 50": { title: "Refractory Masonry", sub: { "04 50 00": "Refractory Masonry", "04 51 00": "Flue Liner Masonry", "04 52 00": "Combustion Chamber Masonry", "04 53 00": "Castable Refractory Masonry", "04 54 00": "Refractory Brick Masonry", "04 57 00": "Masonry Fireplaces" } },
      "04 60": { title: "Corrosion-Resistant Masonry", sub: { "04 60 00": "Corrosion-Resistant Masonry", "04 61 00": "Chemical-Resistant Brick Masonry", "04 62 00": "Vitrified Clay Liner Plate" } },
      "04 70": { title: "Manufactured Masonry", sub: { "04 70 00": "Manufactured Masonry", "04 71 00": "Manufactured Brick Masonry", "04 72 00": "Cast Stone Masonry", "04 73 00": "Manufactured Stone Masonry" } }
    }
  },
  "05": {
    title: "Metals",
    sections: {
      "05 00": { title: "General Metals", sub: { "05 01 00": "Maintenance of Metals", "05 05 00": "Common Work Results for Metals", "05 06 00": "Schedules for Metals", "05 08 00": "Commissioning of Metals" } },
      "05 10": { title: "Structural Metal Framing", sub: { "05 10 00": "Structural Metal Framing", "05 12 00": "Structural Steel Framing", "05 13 00": "Structural Stainless-Steel Framing", "05 14 00": "Structural Aluminum Framing", "05 15 00": "Wire Rope Assemblies", "05 16 00": "Structural Cabling", "05 17 00": "Structural Rod Assemblies", "05 19 00": "Tension Rod and Cable Truss Assemblies" } },
      "05 20": { title: "Metal Joists", sub: { "05 20 00": "Metal Joists", "05 21 00": "Steel Joist Framing", "05 25 00": "Aluminum Joist Framing" } },
      "05 30": { title: "Metal Decking", sub: { "05 30 00": "Metal Decking", "05 31 00": "Steel Decking", "05 33 00": "Aluminum Decking", "05 34 00": "Acoustical Metal Decking", "05 35 00": "Raceway Decking Assemblies", "05 36 00": "Composite Metal Decking" } },
      "05 40": { title: "Cold-Formed Metal Framing", sub: { "05 40 00": "Cold-Formed Metal Framing", "05 41 00": "Structural Metal Stud Framing", "05 42 00": "Cold-Formed Metal Joist Framing", "05 43 00": "Slotted Channel Framing", "05 44 00": "Cold-Formed Metal Trusses", "05 45 00": "Metal Support Assemblies" } },
      "05 50": { title: "Metal Fabrications", sub: { "05 50 00": "Metal Fabrications", "05 51 00": "Metal Stairs", "05 52 00": "Metal Railings", "05 53 00": "Metal Gratings", "05 54 00": "Metal Floor Plates", "05 55 00": "Metal Stair Treads and Nosings", "05 56 00": "Metal Castings", "05 58 00": "Formed Metal Fabrications", "05 59 00": "Metal Specialties" } },
      "05 70": { title: "Decorative Metal", sub: { "05 70 00": "Decorative Metal", "05 71 00": "Decorative Metal Stairs", "05 73 00": "Decorative Metal Railings", "05 74 00": "Decorative Metal Castings", "05 75 00": "Decorative Formed Metal", "05 76 00": "Decorative Forged Metal" } }
    }
  },
  "06": {
    title: "Wood, Plastics, and Composites",
    sections: {
      "06 00": { title: "General Wood/Plastics", sub: { "06 01 00": "Maintenance of Wood, Plastics and Composites", "06 05 00": "Common Work Results", "06 06 00": "Schedules", "06 08 00": "Commissioning" } },
      "06 10": { title: "Rough Carpentry", sub: { "06 10 00": "Rough Carpentry", "06 11 00": "Wood Framing", "06 12 00": "Structural Panels", "06 13 00": "Heavy Timber Construction", "06 14 00": "Treated Wood Foundations", "06 15 00": "Wood Decking", "06 16 00": "Sheathing", "06 17 00": "Shop-Fabricated Structural Wood", "06 18 00": "Glued-Laminated Construction" } },
      "06 20": { title: "Finish Carpentry", sub: { "06 20 00": "Finish Carpentry", "06 22 00": "Millwork", "06 25 00": "Prefinished Paneling", "06 26 00": "Board Paneling" } },
      "06 40": { title: "Architectural Woodwork", sub: { "06 40 00": "Architectural Woodwork", "06 41 00": "Architectural Wood Casework", "06 42 00": "Wood Paneling", "06 43 00": "Wood Stairs and Railings", "06 44 00": "Ornamental Woodwork", "06 46 00": "Wood Trim", "06 48 00": "Wood Frames", "06 49 00": "Wood Screens and Exterior Wood Shutters" } },
      "06 50": { title: "Structural Plastics", sub: { "06 50 00": "Structural Plastics", "06 51 00": "Structural Plastic Shapes and Plates", "06 52 00": "Plastic Structural Assemblies", "06 53 00": "Plastic Decking" } },
      "06 60": { title: "Plastic Fabrications", sub: { "06 60 00": "Plastic Fabrications", "06 61 00": "Simulated Stone Fabrications", "06 63 00": "Plastic Railings", "06 64 00": "Plastic Paneling", "06 65 00": "Plastic Simulated Wood Trim", "06 66 00": "Custom Ornamental Simulated Woodwork" } },
      "06 70": { title: "Structural Composites", sub: { "06 70 00": "Structural Composites", "06 71 00": "Structural Composite Shapes and Plates", "06 72 00": "Composite Structural Assemblies", "06 73 00": "Composite Decking", "06 74 00": "Composite Gratings" } },
      "06 80": { title: "Composite Fabrications", sub: { "06 80 00": "Composite Fabrications", "06 81 00": "Composite Railings", "06 83 00": "Composite Paneling" } }
    }
  },
  "07": {
    title: "Thermal and Moisture Protection",
    sections: {
      "07 00": { title: "General Thermal/Moisture", sub: { "07 01 00": "Operation and Maintenance", "07 05 00": "Common Work Results", "07 06 00": "Schedules", "07 08 00": "Commissioning" } },
      "07 10": { title: "Dampproofing and Waterproofing", sub: { "07 10 00": "Dampproofing and Waterproofing", "07 11 00": "Dampproofing", "07 12 00": "Built-Up Bituminous Waterproofing", "07 13 00": "Sheet Waterproofing", "07 14 00": "Fluid-Applied Waterproofing", "07 15 00": "Sheet Metal Waterproofing", "07 16 00": "Cementitious and Reactive Waterproofing", "07 17 00": "Bentonite Waterproofing", "07 18 00": "Traffic Coatings", "07 19 00": "Water Repellents" } },
      "07 20": { title: "Thermal Protection", sub: { "07 20 00": "Thermal Protection", "07 21 00": "Thermal Insulation", "07 22 00": "Roof and Deck Insulation", "07 24 00": "Exterior Insulation and Finish Systems", "07 25 00": "Weather Barriers", "07 26 00": "Vapor Retarders", "07 27 00": "Air Barriers" } },
      "07 30": { title: "Steep Slope Roofing", sub: { "07 30 00": "Steep Slope Roofing", "07 31 00": "Shingles and Shakes", "07 32 00": "Roof Tiles", "07 33 00": "Natural Roof Coverings" } },
      "07 40": { title: "Roofing and Siding Panels", sub: { "07 40 00": "Roofing and Siding Panels", "07 41 00": "Roof Panels", "07 42 00": "Wall Panels", "07 44 00": "Faced Panels", "07 46 00": "Siding" } },
      "07 50": { title: "Membrane Roofing", sub: { "07 50 00": "Membrane Roofing", "07 51 00": "Built-Up Bituminous Roofing", "07 52 00": "Modified Bituminous Membrane Roofing", "07 53 00": "Elastomeric Membrane Roofing", "07 54 00": "Thermoplastic Membrane Roofing", "07 55 00": "Protected Membrane Roofing", "07 56 00": "Fluid-Applied Roofing", "07 57 00": "Coated Foamed Roofing", "07 58 00": "Roll Roofing" } },
      "07 60": { title: "Flashing and Sheet Metal", sub: { "07 60 00": "Flashing and Sheet Metal", "07 61 00": "Sheet Metal Roofing", "07 62 00": "Sheet Metal Flashing and Trim", "07 63 00": "Sheet Metal Roofing Specialties", "07 64 00": "Sheet Metal Wall Cladding", "07 65 00": "Flexible Flashing" } },
      "07 70": { title: "Roof/Wall Specialties", sub: { "07 70 00": "Roof and Wall Specialties and Accessories", "07 71 00": "Roof Specialties", "07 72 00": "Roof Accessories", "07 76 00": "Roof Pavers", "07 77 00": "Wall Specialties" } },
      "07 80": { title: "Fire and Smoke Protection", sub: { "07 80 00": "Fire and Smoke Protection", "07 81 00": "Applied Fireproofing", "07 82 00": "Board Fireproofing", "07 84 00": "Firestopping", "07 86 00": "Smoke Seals", "07 87 00": "Smoke Containment Barriers" } },
      "07 90": { title: "Joint Protection", sub: { "07 90 00": "Joint Protection", "07 91 00": "Preformed Joint Seals", "07 92 00": "Joint Sealants", "07 95 00": "Expansion Control" } }
    }
  },
  "08": {
    title: "Openings",
    sections: {
      "08 00": { title: "General Openings", sub: { "08 01 00": "Operation and Maintenance", "08 05 00": "Common Work Results", "08 06 00": "Schedules", "08 08 00": "Commissioning" } },
      "08 10": { title: "Doors and Frames", sub: { "08 10 00": "Doors and Frames", "08 11 00": "Metal Doors and Frames", "08 12 00": "Metal Frames", "08 13 00": "Metal Doors", "08 14 00": "Wood Doors", "08 15 00": "Plastic Doors", "08 16 00": "Composite Doors", "08 17 00": "Integrated Door Opening Assemblies" } },
      "08 30": { title: "Specialty Doors", sub: { "08 30 00": "Specialty Doors and Frames", "08 31 00": "Access Doors and Panels", "08 32 00": "Sliding Glass Doors", "08 33 00": "Coiling Doors and Grilles", "08 34 00": "Special Function Doors", "08 35 00": "Folding Doors and Grilles", "08 36 00": "Panel Doors", "08 38 00": "Traffic Doors", "08 39 00": "Pressure-Resistant Doors" } },
      "08 40": { title: "Entrances and Storefronts", sub: { "08 40 00": "Entrances, Storefronts and Curtain Walls", "08 41 00": "Entrances and Storefronts", "08 42 00": "Entrances", "08 43 00": "Storefronts", "08 44 00": "Curtain Wall and Glazed Assemblies", "08 45 00": "Translucent Wall and Roof Assemblies" } },
      "08 50": { title: "Windows", sub: { "08 50 00": "Windows", "08 51 00": "Metal Windows", "08 52 00": "Wood Windows", "08 53 00": "Plastic Windows", "08 54 00": "Composite Windows", "08 55 00": "Pressure-Resistant Windows", "08 56 00": "Special Function Windows" } },
      "08 60": { title: "Roof Windows", sub: { "08 60 00": "Roof Windows and Skylights", "08 61 00": "Roof Windows", "08 62 00": "Unit Skylights", "08 63 00": "Metal-Framed Skylights", "08 64 00": "Plastic-Framed Skylights", "08 67 00": "Skylight Protection and Screens" } },
      "08 70": { title: "Hardware", sub: { "08 70 00": "Hardware", "08 71 00": "Door Hardware", "08 74 00": "Access Control Hardware", "08 75 00": "Window Hardware", "08 78 00": "Special Function Hardware", "08 79 00": "Hardware Accessories" } },
      "08 80": { title: "Glazing", sub: { "08 80 00": "Glazing", "08 81 00": "Glass Glazing", "08 83 00": "Mirrors", "08 84 00": "Plastic Glazing", "08 85 00": "Glazing Accessories", "08 87 00": "Glazing Surface Films", "08 88 00": "Special Function Glazing" } },
      "08 90": { title: "Louvers and Vents", sub: { "08 90 00": "Louvers and Vents", "08 91 00": "Louvers", "08 92 00": "Louvered Equipment Enclosures", "08 95 00": "Vents" } }
    }
  },
  "09": {
    title: "Finishes",
    sections: {
      "09 00": { title: "General Finishes", sub: { "09 01 00": "Maintenance of Finishes", "09 05 00": "Common Work Results", "09 06 00": "Schedules", "09 06 00.13": "Room Finish Schedule", "09 08 00": "Commissioning" } },
      "09 20": { title: "Plaster and Gypsum Board", sub: { "09 20 00": "Plaster and Gypsum Board", "09 21 00": "Plaster and Gypsum Board Assemblies", "09 22 00": "Supports", "09 23 00": "Gypsum Plastering", "09 24 00": "Cement Plastering", "09 25 00": "Other Plastering", "09 26 00": "Veneer Plastering", "09 27 00": "Plaster Fabrications", "09 28 00": "Backing Boards and Underlayments", "09 29 00": "Gypsum Board" } },
      "09 30": { title: "Tiling", sub: { "09 30 00": "Tiling", "09 31 00": "Thin-Set Tiling", "09 32 00": "Mortar-Bed Tiling", "09 33 00": "Conductive Tiling", "09 34 00": "Waterproofing-Membrane Tiling", "09 35 00": "Chemical-Resistant Tiling" } },
      "09 50": { title: "Ceilings", sub: { "09 50 00": "Ceilings", "09 51 00": "Acoustical Ceilings", "09 53 00": "Acoustical Ceiling Suspension Assemblies", "09 54 00": "Specialty Ceilings", "09 56 00": "Textured Ceilings", "09 57 00": "Special Function Ceilings", "09 58 00": "Integrated Ceiling Assemblies" } },
      "09 60": { title: "Flooring", sub: { "09 60 00": "Flooring", "09 61 00": "Flooring Treatment", "09 62 00": "Specialty Flooring", "09 63 00": "Masonry Flooring", "09 64 00": "Wood Flooring", "09 65 00": "Resilient Flooring", "09 66 00": "Terrazzo Flooring", "09 67 00": "Fluid-Applied Flooring", "09 68 00": "Carpeting", "09 69 00": "Access Flooring" } },
      "09 70": { title: "Wall Finishes", sub: { "09 70 00": "Wall Finishes", "09 72 00": "Wall Coverings", "09 73 00": "Wall Carpeting", "09 74 00": "Flexible Wood Sheets", "09 75 00": "Stone Facing", "09 76 00": "Plastic Blocks", "09 77 00": "Special Wall Surfacing", "09 78 00": "Interior Wall Paneling" } },
      "09 80": { title: "Acoustic Treatment", sub: { "09 80 00": "Acoustic Treatment", "09 81 00": "Acoustic Insulation", "09 83 00": "Acoustic Finishes", "09 84 00": "Acoustic Room Components" } },
      "09 90": { title: "Painting and Coating", sub: { "09 90 00": "Painting and Coating", "09 91 00": "Painting", "09 93 00": "Staining and Transparent Finishing", "09 94 00": "Decorative Finishing", "09 96 00": "High-Performance Coatings", "09 97 00": "Special Coatings" } }
    }
  },
  "10": {
    title: "Specialties",
    sections: {
      "10 00": { title: "General Specialties", sub: { "10 00 00": "Specialties", "10 01 00": "Operation and Maintenance", "10 05 00": "Common Work Results", "10 06 00": "Schedules", "10 08 00": "Commissioning" } },
      "10 10": { title: "Information Specialties", sub: { "10 10 00": "Information Specialties", "10 11 00": "Visual Display Units", "10 12 00": "Display Cases", "10 13 00": "Directories", "10 14 00": "Signage", "10 17 00": "Telephone Specialties", "10 18 00": "Informational Kiosks" } },
      "10 20": { title: "Interior Specialties", sub: { "10 20 00": "Interior Specialties", "10 21 00": "Compartments and Cubicles", "10 22 00": "Partitions", "10 25 00": "Service Walls", "10 26 00": "Wall and Door Protection", "10 28 00": "Toilet, Bath and Laundry Accessories" } },
      "10 30": { title: "Fireplaces and Stoves", sub: { "10 30 00": "Fireplaces and Stoves", "10 31 00": "Manufactured Fireplaces", "10 32 00": "Fireplace Specialties", "10 35 00": "Stoves" } },
      "10 40": { title: "Safety Specialties", sub: { "10 40 00": "Safety Specialties", "10 41 00": "Emergency Access and Information Cabinets", "10 43 00": "Emergency Aid Specialties", "10 44 00": "Fire Protection Specialties" } },
      "10 50": { title: "Storage Specialties", sub: { "10 50 00": "Storage Specialties", "10 51 00": "Lockers", "10 55 00": "Postal Specialties", "10 56 00": "Storage Assemblies", "10 57 00": "Wardrobe and Closet Specialties" } },
      "10 70": { title: "Exterior Specialties", sub: { "10 70 00": "Exterior Specialties", "10 71 00": "Exterior Protection", "10 73 00": "Protective Covers", "10 74 00": "Manufactured Exterior Specialties", "10 75 00": "Flagpoles" } },
      "10 80": { title: "Other Specialties", sub: { "10 80 00": "Other Specialties", "10 81 00": "Pest Control Devices", "10 82 00": "Grilles and Screens", "10 83 00": "Flags and Banners", "10 84 00": "Gas Lighting", "10 86 00": "Security Mirrors and Domes", "10 88 00": "Scales" } }
    }
  },
  "11": {
    title: "Equipment",
    sections: {
      "11 00": { title: "General Equipment", sub: { "11 00 00": "Equipment", "11 01 00": "Operation and Maintenance", "11 05 00": "Common Work Results", "11 06 00": "Schedules", "11 08 00": "Commissioning" } },
      "11 10": { title: "Vehicle and Pedestrian Equipment", sub: { "11 10 00": "Vehicle and Pedestrian Equipment", "11 11 00": "Vehicle Service Equipment", "11 12 00": "Parking Control Equipment", "11 13 00": "Loading Dock Equipment", "11 14 00": "Pedestrian Control Equipment", "11 15 00": "Security, Detention and Banking Equipment", "11 16 00": "Vault Equipment", "11 17 00": "Teller and Service Equipment", "11 18 00": "Security Equipment", "11 19 00": "Detention Equipment" } },
      "11 20": { title: "Commercial Equipment", sub: { "11 20 00": "Commercial Equipment", "11 21 00": "Mercantile and Service Equipment", "11 22 00": "Refrigerated Display Equipment", "11 23 00": "Commercial Laundry and Dry Cleaning Equipment", "11 24 00": "Maintenance Equipment", "11 25 00": "Hospitality Equipment", "11 26 00": "Unit Kitchens", "11 27 00": "Photographic Processing Equipment", "11 28 00": "Office Equipment", "11 29 00": "Postal, Packaging and Shipping Equipment" } },
      "11 30": { title: "Residential Equipment", sub: { "11 30 00": "Residential Equipment", "11 31 00": "Residential Appliances", "11 33 00": "Retractable Stairs", "11 34 00": "Residential Ceiling Fans" } },
      "11 40": { title: "Foodservice Equipment", sub: { "11 40 00": "Foodservice Equipment", "11 41 00": "Foodservice Storage Equipment", "11 42 00": "Food Preparation Equipment", "11 43 00": "Food Delivery Carts and Conveyors", "11 44 00": "Food Cooking Equipment", "11 46 00": "Food Dispensing Equipment", "11 47 00": "Ice Machines", "11 48 00": "Cleaning and Disposal Equipment" } },
      "11 50": { title: "Educational and Scientific Equipment", sub: { "11 50 00": "Educational and Scientific Equipment", "11 51 00": "Library Equipment", "11 52 00": "Audio-Visual Equipment", "11 53 00": "Laboratory Equipment", "11 55 00": "Planetarium Equipment", "11 56 00": "Observatory Equipment", "11 57 00": "Vocational Shop Equipment", "11 59 00": "Exhibit Equipment" } },
      "11 60": { title: "Entertainment and Recreation Equipment", sub: { "11 60 00": "Entertainment Equipment", "11 61 00": "Broadcast, Theater and Stage Equipment", "11 62 00": "Musical Equipment", "11 65 00": "Athletic and Recreational Equipment", "11 66 00": "Athletic Equipment", "11 67 00": "Recreational Equipment", "11 68 00": "Play Field Equipment and Structures" } },
      "11 70": { title: "Healthcare Equipment", sub: { "11 70 00": "Healthcare Equipment", "11 71 00": "Medical Sterilizing Equipment", "11 72 00": "Examination and Treatment Equipment", "11 73 00": "Patient Care Equipment", "11 74 00": "Dental Equipment", "11 75 00": "Optical Equipment", "11 76 00": "Operating Room Equipment", "11 77 00": "Radiology Equipment", "11 78 00": "Mortuary Equipment", "11 79 00": "Therapy Equipment" } },
      "11 80": { title: "Collection and Disposal Equipment", sub: { "11 80 00": "Collection and Disposal Equipment", "11 82 00": "Solid Waste Handling Equipment" } },
      "11 90": { title: "Other Equipment", sub: { "11 90 00": "Other Equipment", "11 91 00": "Religious Equipment", "11 92 00": "Agricultural Equipment", "11 93 00": "Horticultural Equipment", "11 95 00": "Arts and Crafts Equipment" } }
    }
  },
  "12": {
    title: "Furnishings",
    sections: {
      "12 00": { title: "General Furnishings", sub: { "12 00 00": "Furnishings", "12 01 00": "Operation and Maintenance", "12 05 00": "Common Work Results", "12 06 00": "Schedules", "12 08 00": "Commissioning" } },
      "12 10": { title: "Art", sub: { "12 10 00": "Art", "12 11 00": "Murals", "12 12 00": "Wall Decorations", "12 14 00": "Sculptures", "12 17 00": "Art Glass", "12 19 00": "Religious Art" } },
      "12 20": { title: "Window Treatments", sub: { "12 20 00": "Window Treatments", "12 21 00": "Window Blinds", "12 22 00": "Curtains and Drapes", "12 23 00": "Interior Shutters", "12 24 00": "Window Shades", "12 25 00": "Window Treatment Operating Hardware", "12 26 00": "Interior Daylighting Devices" } },
      "12 30": { title: "Casework", sub: { "12 30 00": "Casework", "12 31 00": "Manufactured Metal Casework", "12 32 00": "Manufactured Wood Casework", "12 34 00": "Manufactured Plastic Casework", "12 35 00": "Specialty Casework", "12 36 00": "Countertops" } },
      "12 40": { title: "Furnishings and Accessories", sub: { "12 40 00": "Furnishings and Accessories", "12 41 00": "Office Accessories", "12 42 00": "Table Accessories", "12 43 00": "Portable Lamps", "12 44 00": "Bath Furnishings", "12 45 00": "Bedroom Furnishings", "12 46 00": "Furnishing Accessories", "12 48 00": "Rugs and Mats" } },
      "12 50": { title: "Furniture", sub: { "12 50 00": "Furniture", "12 51 00": "Office Furniture", "12 52 00": "Seating", "12 53 00": "Retail Furniture", "12 54 00": "Hospitality Furniture", "12 55 00": "Detention Furniture", "12 56 00": "Institutional Furniture", "12 57 00": "Industrial Furniture", "12 58 00": "Residential Furniture", "12 59 00": "Systems Furniture" } },
      "12 60": { title: "Multiple Seating", sub: { "12 60 00": "Multiple Seating", "12 61 00": "Fixed Audience Seating", "12 62 00": "Portable Audience Seating", "12 63 00": "Stadium and Arena Seating", "12 64 00": "Booths and Tables", "12 65 00": "Multiple-Use Fixed Seating", "12 66 00": "Telescoping Stands", "12 67 00": "Pews and Benches", "12 68 00": "Seat and Table Assemblies" } },
      "12 90": { title: "Other Furnishings", sub: { "12 90 00": "Other Furnishings", "12 92 00": "Interior Planters and Artificial Plants", "12 93 00": "Site Furnishings" } }
    }
  },
  "13": {
    title: "Special Construction",
    sections: {
      "13 00": { title: "General Special Construction", sub: { "13 00 00": "Special Construction", "13 01 00": "Operation and Maintenance", "13 05 00": "Common Work Results", "13 06 00": "Schedules", "13 08 00": "Commissioning" } },
      "13 10": { title: "Special Facility Components", sub: { "13 10 00": "Special Facility Components", "13 11 00": "Swimming Pools", "13 12 00": "Fountains", "13 13 00": "Aquariums", "13 14 00": "Amusement Park Structures and Equipment", "13 17 00": "Tubs and Pools", "13 18 00": "Ice Rinks", "13 19 00": "Kennels and Animal Shelters" } },
      "13 20": { title: "Special Purpose Rooms", sub: { "13 20 00": "Special Purpose Rooms", "13 21 00": "Controlled Environment Rooms", "13 22 00": "Office Shelters and Booths", "13 23 00": "Planetariums", "13 24 00": "Special Activity Rooms", "13 26 00": "Fabricated Rooms", "13 27 00": "Vaults", "13 28 00": "Athletic and Recreational Special Construction" } },
      "13 30": { title: "Special Structures", sub: { "13 30 00": "Special Structures", "13 31 00": "Fabric Structures", "13 32 00": "Space Frames", "13 33 00": "Geodesic Structures", "13 34 00": "Fabricated Engineered Structures", "13 35 00": "Rammed Earth Construction", "13 36 00": "Towers" } },
      "13 40": { title: "Integrated Construction", sub: { "13 40 00": "Integrated Construction", "13 42 00": "Building Modules", "13 44 00": "Modular Mezzanines", "13 48 00": "Sound, Vibration and Seismic Control", "13 49 00": "Radiation Protection" } },
      "13 50": { title: "Special Instrumentation", sub: { "13 50 00": "Special Instrumentation", "13 51 00": "Stress Instrumentation", "13 52 00": "Seismic Instrumentation", "13 53 00": "Meteorological Instrumentation" } }
    }
  },
  "14": {
    title: "Conveying Equipment",
    sections: {
      "14 00": { title: "General Conveying Equipment", sub: { "14 00 00": "Conveying Equipment", "14 01 00": "Operation and Maintenance", "14 05 00": "Common Work Results", "14 06 00": "Schedules", "14 08 00": "Commissioning" } },
      "14 10": { title: "Dumbwaiters", sub: { "14 10 00": "Dumbwaiters", "14 11 00": "Manual Dumbwaiters", "14 12 00": "Electric Dumbwaiters", "14 14 00": "Hydraulic Dumbwaiters" } },
      "14 20": { title: "Elevators", sub: { "14 20 00": "Elevators", "14 21 00": "Electric Traction Elevators", "14 24 00": "Hydraulic Elevators", "14 26 00": "Limited-Use/Limited-Application Elevators", "14 27 00": "Custom Elevator Cabs and Doors", "14 28 00": "Elevator Equipment and Controls" } },
      "14 30": { title: "Escalators and Moving Walks", sub: { "14 30 00": "Escalators and Moving Walks", "14 31 00": "Escalators", "14 32 00": "Moving Walks", "14 33 00": "Moving Ramps" } },
      "14 40": { title: "Lifts", sub: { "14 40 00": "Lifts", "14 41 00": "People Lifts", "14 42 00": "Wheelchair Lifts", "14 43 00": "Platform Lifts", "14 44 00": "Sidewalk Lifts", "14 45 00": "Vehicle Lifts" } },
      "14 70": { title: "Turntables", sub: { "14 70 00": "Turntables", "14 71 00": "Industrial Turntables", "14 72 00": "Hospitality Turntables", "14 73 00": "Exhibit Turntables", "14 74 00": "Entertainment Turntables" } },
      "14 80": { title: "Scaffolding", sub: { "14 80 00": "Scaffolding", "14 81 00": "Suspended Scaffolding", "14 82 00": "Rope Climbers", "14 83 00": "Elevating Platforms", "14 84 00": "Powered Scaffolding" } },
      "14 90": { title: "Other Conveying Equipment", sub: { "14 90 00": "Other Conveying Equipment", "14 91 00": "Facility Chutes", "14 92 00": "Pneumatic Tube Systems", "14 93 00": "Slide Pole Systems" } }
    }
  },
  "21": {
    title: "Fire Suppression",
    sections: {
      "21 00": { title: "General Fire Suppression", sub: { "21 00 00": "Fire Suppression", "21 01 00": "Operation and Maintenance", "21 05 00": "Common Work Results", "21 06 00": "Schedules", "21 07 00": "Fire Suppression Systems Insulation", "21 08 00": "Commissioning", "21 09 00": "Instrumentation and Control" } },
      "21 10": { title: "Water-Based Fire-Suppression Systems", sub: { "21 10 00": "Water-Based Fire-Suppression Systems", "21 11 00": "Facility Fire-Suppression Water-Service Piping", "21 12 00": "Fire-Suppression Standpipes", "21 13 00": "Fire-Suppression Sprinkler Systems", "21 16 00": "Fire-Suppression Pressure Maintenance Pumps" } },
      "21 20": { title: "Fire-Extinguishing Systems", sub: { "21 20 00": "Fire-Extinguishing Systems", "21 21 00": "Carbon-Dioxide Fire-Extinguishing Systems", "21 22 00": "Clean-Agent Fire-Extinguishing Systems", "21 23 00": "Wet-Chemical Fire-Extinguishing Systems", "21 24 00": "Dry-Chemical Fire-Extinguishing Systems" } },
      "21 30": { title: "Fire Pumps", sub: { "21 30 00": "Fire Pumps", "21 31 00": "Centrifugal Fire Pumps", "21 32 00": "Vertical-Turbine Fire Pumps", "21 33 00": "Positive-Displacement Fire Pumps" } },
      "21 40": { title: "Fire-Suppression Water Storage", sub: { "21 40 00": "Fire-Suppression Water Storage", "21 41 00": "Storage Tanks for Fire-Suppression Water" } }
    }
  },
  "22": {
    title: "Plumbing",
    sections: {
      "22 00": { title: "General Plumbing", sub: { "22 00 00": "Plumbing", "22 01 00": "Operation and Maintenance", "22 05 00": "Common Work Results", "22 06 00": "Schedules", "22 07 00": "Plumbing Insulation", "22 08 00": "Commissioning", "22 09 00": "Instrumentation and Control" } },
      "22 10": { title: "Plumbing Piping", sub: { "22 10 00": "Plumbing Piping", "22 11 00": "Facility Water Distribution", "22 12 00": "Facility Potable-Water Storage Tanks", "22 13 00": "Facility Sanitary Sewerage", "22 14 00": "Facility Storm Drainage", "22 15 00": "General Service Compressed-Air Systems" } },
      "22 30": { title: "Plumbing Equipment", sub: { "22 30 00": "Plumbing Equipment", "22 31 00": "Domestic Water Softeners", "22 32 00": "Domestic Water Filtration Equipment", "22 33 00": "Electric Domestic Water Heaters", "22 34 00": "Fuel-Fired Domestic Water Heaters", "22 35 00": "Domestic Water Heat Exchangers" } },
      "22 40": { title: "Plumbing Fixtures", sub: { "22 40 00": "Plumbing Fixtures", "22 41 00": "Residential Plumbing Fixtures", "22 42 00": "Commercial Plumbing Fixtures", "22 43 00": "Healthcare Plumbing Fixtures", "22 45 00": "Emergency Plumbing Fixtures", "22 46 00": "Security Plumbing Fixtures", "22 47 00": "Drinking Fountains and Water Coolers" } },
      "22 50": { title: "Pool and Fountain Plumbing Systems", sub: { "22 50 00": "Pool and Fountain Plumbing Systems", "22 51 00": "Swimming Pool Plumbing Systems", "22 52 00": "Fountain Plumbing Systems" } },
      "22 60": { title: "Gas and Vacuum Systems", sub: { "22 60 00": "Gas and Vacuum Systems for Laboratory and Healthcare Facilities", "22 61 00": "Compressed-Air Systems for Laboratory and Healthcare Facilities", "22 62 00": "Vacuum Systems for Laboratory and Healthcare Facilities", "22 63 00": "Gas Systems for Laboratory and Healthcare Facilities", "22 66 00": "Chemical-Waste Systems for Laboratory and Healthcare Facilities", "22 67 00": "Processed Water Systems for Laboratory and Healthcare Facilities" } }
    }
  },
  "23": {
    title: "HVAC",
    sections: {
      "23 00": { title: "General HVAC", sub: { "23 00 00": "Heating, Ventilating and Air Conditioning (HVAC)", "23 01 00": "Operation and Maintenance", "23 05 00": "Common Work Results", "23 06 00": "Schedules", "23 07 00": "HVAC Insulation", "23 08 00": "Commissioning", "23 09 00": "Instrumentation and Control" } },
      "23 10": { title: "Facility Fuel Systems", sub: { "23 10 00": "Facility Fuel Systems", "23 11 00": "Facility Fuel Piping", "23 12 00": "Facility Fuel Pumps", "23 13 00": "Facility Fuel-Storage Tanks" } },
      "23 20": { title: "HVAC Piping and Pumps", sub: { "23 20 00": "HVAC Piping and Pumps", "23 21 00": "Hydronic Piping and Pumps", "23 22 00": "Steam and Condensate Piping and Pumps", "23 23 00": "Refrigerant Piping", "23 24 00": "Internal-Combustion Engine Piping", "23 25 00": "HVAC Water Treatment" } },
      "23 30": { title: "HVAC Air Distribution", sub: { "23 30 00": "HVAC Air Distribution", "23 31 00": "HVAC Ducts and Casings", "23 32 00": "Air Plenums and Chases", "23 33 00": "Air Duct Accessories", "23 34 00": "HVAC Fans", "23 35 00": "Special Exhaust Systems", "23 36 00": "Air Terminal Units", "23 37 00": "Air Outlets and Inlets", "23 38 00": "Ventilation Hoods" } },
      "23 40": { title: "HVAC Air Cleaning Devices", sub: { "23 40 00": "HVAC Air Cleaning Devices", "23 41 00": "Particulate Air Filtration", "23 42 00": "Gas-Phase Air Filtration", "23 43 00": "Electronic Air Cleaners" } },
      "23 50": { title: "Central Heating Equipment", sub: { "23 50 00": "Central Heating Equipment", "23 51 00": "Breechings, Chimneys and Stacks", "23 52 00": "Heating Boilers", "23 53 00": "Heating Boiler Feedwater Equipment", "23 54 00": "Furnaces", "23 55 00": "Fuel-Fired Heaters", "23 56 00": "Solar Energy Heating Equipment", "23 57 00": "Heat Exchangers for HVAC" } },
      "23 60": { title: "Central Cooling Equipment", sub: { "23 60 00": "Central Cooling Equipment", "23 61 00": "Refrigerant Compressors", "23 62 00": "Packaged Compressor and Condenser Units", "23 63 00": "Refrigerant Condensers", "23 64 00": "Packaged Water Chillers", "23 65 00": "Cooling Towers" } },
      "23 70": { title: "Central HVAC Equipment", sub: { "23 70 00": "Central HVAC Equipment", "23 71 00": "Thermal Storage", "23 72 00": "Air-to-Air Energy Recovery Equipment", "23 73 00": "Indoor Central-Station Air-Handling Units", "23 74 00": "Packaged Outdoor HVAC Equipment", "23 75 00": "Custom-Packaged Outdoor HVAC Equipment", "23 76 00": "Evaporative Air-Cooling Equipment" } },
      "23 80": { title: "Decentralized HVAC Equipment", sub: { "23 80 00": "Decentralized HVAC Equipment", "23 81 00": "Decentralized Unitary HVAC Equipment", "23 82 00": "Convection Heating and Cooling Units", "23 83 00": "Radiant Heating Units", "23 84 00": "Humidity Control Equipment" } }
    }
  },
  "25": {
    title: "Integrated Automation",
    sections: {
      "25 00": { title: "General Integrated Automation", sub: { "25 00 00": "Integrated Automation", "25 01 00": "Operation and Maintenance", "25 05 00": "Common Work Results", "25 06 00": "Schedules", "25 08 00": "Commissioning" } },
      "25 10": { title: "Integrated Automation Network Equipment", sub: { "25 10 00": "Integrated Automation Network Equipment", "25 11 00": "Integrated Automation Network Devices", "25 12 00": "Integrated Automation Network Gateways", "25 13 00": "Control and Monitoring Network", "25 14 00": "Local Control Units", "25 15 00": "Software" } },
      "25 30": { title: "Integrated Automation Instrumentation", sub: { "25 30 00": "Instrumentation and Terminal Devices", "25 31 00": "For Facility Equipment", "25 32 00": "For Conveying Equipment", "25 33 00": "For Fire-Suppression", "25 34 00": "For Plumbing", "25 35 00": "For HVAC", "25 36 00": "For Electrical Systems", "25 37 00": "For Communications", "25 38 00": "For Electronic Safety/Security" } },
      "25 50": { title: "Integrated Automation Facility Controls", sub: { "25 50 00": "Facility Controls", "25 51 00": "Control of Facility Equipment", "25 52 00": "Control of Conveying Equipment", "25 53 00": "Control of Fire-Suppression", "25 54 00": "Control of Plumbing", "25 55 00": "Control of HVAC", "25 56 00": "Control of Electrical Systems", "25 57 00": "Control of Communications", "25 58 00": "Control of Electronic Safety/Security" } },
      "25 90": { title: "Integrated Automation Control Sequences", sub: { "25 90 00": "Control Sequences", "25 91 00": "For Facility Equipment", "25 92 00": "For Conveying Equipment", "25 93 00": "For Fire-Suppression", "25 94 00": "For Plumbing", "25 95 00": "For HVAC", "25 96 00": "For Electrical Systems", "25 97 00": "For Communications", "25 98 00": "For Electronic Safety/Security" } }
    }
  },
  "26": {
    title: "Electrical",
    sections: {
      "26 00": { title: "General Electrical", sub: { "26 00 00": "Electrical", "26 01 00": "Operation and Maintenance", "26 05 00": "Common Work Results", "26 06 00": "Schedules", "26 08 00": "Commissioning", "26 09 00": "Instrumentation and Control" } },
      "26 10": { title: "Medium-Voltage Electrical Distribution", sub: { "26 10 00": "Medium-Voltage Electrical Distribution", "26 11 00": "Substations", "26 12 00": "Medium-Voltage Transformers", "26 13 00": "Medium-Voltage Switchgear", "26 16 00": "Medium-Voltage Metering", "26 18 00": "Medium-Voltage Circuit Protection Devices" } },
      "26 20": { title: "Low-Voltage Electrical Transmission", sub: { "26 20 00": "Low-Voltage Electrical Transmission", "26 21 00": "Service Entrance", "26 22 00": "Transformers", "26 23 00": "Switchgear", "26 24 00": "Switchboards and Panelboards", "26 25 00": "Enclosed Bus Assemblies", "26 26 00": "Power Distribution Units", "26 27 00": "Distribution Equipment", "26 28 00": "Circuit Protective Devices", "26 29 00": "Controllers" } },
      "26 30": { title: "Facility Electrical Power Generating", sub: { "26 30 00": "Generating and Storing Equipment", "26 31 00": "Photovoltaic Collectors", "26 32 00": "Packaged Generator Assemblies", "26 33 00": "Battery Equipment", "26 35 00": "Power Filters and Conditioners", "26 36 00": "Transfer Switches" } },
      "26 40": { title: "Electrical and Cathodic Protection", sub: { "26 40 00": "Electrical and Cathodic Protection", "26 41 00": "Facility Lightning Protection", "26 42 00": "Cathodic Protection", "26 43 00": "Surge Protective Devices" } },
      "26 50": { title: "Lighting", sub: { "26 50 00": "Lighting", "26 51 00": "Interior Lighting", "26 52 00": "Emergency Lighting", "26 53 00": "Exit Signs", "26 54 00": "Classified Location Lighting", "26 55 00": "Special Purpose Lighting", "26 56 00": "Exterior Lighting" } }
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
      "31 00": { title: "General Earthwork", sub: { "31 00 00": "Earthwork", "31 01 00": "Maintenance of Earthwork", "31 05 00": "Common Work Results", "31 06 00": "Schedules", "31 08 00": "Commissioning", "31 09 00": "Geotechnical Instrumentation/Monitoring" } },
      "31 10": { title: "Site Clearing", sub: { "31 10 00": "Site Clearing", "31 11 00": "Clearing and Grubbing", "31 12 00": "Selective Clearing", "31 13 00": "Selective Tree and Shrub Removal", "31 14 00": "Earth Stripping and Stockpiling" } },
      "31 20": { title: "Earth Moving", sub: { "31 20 00": "Earth Moving", "31 21 00": "Off-Gassing Mitigation", "31 22 00": "Grading", "31 23 00": "Excavation and Fill", "31 24 00": "Embankments", "31 25 00": "Erosion and Sedimentation Controls" } },
      "31 30": { title: "Earthwork Methods", sub: { "31 30 00": "Earthwork Methods", "31 31 00": "Soil Treatment", "31 32 00": "Soil Stabilization", "31 33 00": "Rock Stabilization", "31 34 00": "Soil Reinforcement", "31 35 00": "Slope Protection", "31 36 00": "Gabions", "31 37 00": "Riprap" } },
      "31 40": { title: "Shoring and Underpinning", sub: { "31 40 00": "Shoring and Underpinning", "31 41 00": "Shoring", "31 43 00": "Concrete Raising", "31 45 00": "Vibroflotation and Densification", "31 46 00": "Needle Beams", "31 48 00": "Underpinning" } },
      "31 50": { title: "Excavation Support and Protection", sub: { "31 50 00": "Excavation Support and Protection", "31 51 00": "Anchor Tiebacks", "31 52 00": "Cofferdams", "31 53 00": "Cribbing and Walers", "31 54 00": "Ground Freezing", "31 56 00": "Slurry Walls" } },
      "31 60": { title: "Special Foundations", sub: { "31 60 00": "Special Foundations and Load-Bearing Elements", "31 62 00": "Driven Piles", "31 63 00": "Bored Piles", "31 64 00": "Caissons", "31 66 00": "Special Foundations", "31 68 00": "Foundation Anchors" } },
      "31 70": { title: "Tunneling and Mining", sub: { "31 70 00": "Tunneling and Mining", "31 71 00": "Tunnel Excavation", "31 72 00": "Tunnel Support Systems", "31 73 00": "Tunnel Grouting", "31 74 00": "Tunnel Construction", "31 75 00": "Shaft Construction", "31 77 00": "Submersible Tube Tunnels" } }
    }
  },
  "32": {
    title: "Exterior Improvements",
    sections: {
      "32 00": { title: "General Exterior Improvements", sub: { "32 00 00": "Exterior Improvements", "32 01 00": "Operation and Maintenance", "32 05 00": "Common Work Results", "32 06 00": "Schedules", "32 08 00": "Commissioning" } },
      "32 10": { title: "Bases, Ballasts and Paving", sub: { "32 10 00": "Bases, Ballasts and Paving", "32 11 00": "Base Courses", "32 12 00": "Flexible Paving", "32 13 00": "Rigid Paving", "32 14 00": "Unit Paving", "32 15 00": "Aggregate Surfacing", "32 16 00": "Curbs, Gutters, Sidewalks and Driveways", "32 17 00": "Paving Specialties", "32 18 00": "Athletic and Recreational Surfacing" } },
      "32 30": { title: "Site Improvements", sub: { "32 30 00": "Site Improvements", "32 31 00": "Fences and Gates", "32 32 00": "Retaining Walls", "32 34 00": "Fabricated Bridges", "32 35 00": "Screening Devices", "32 39 00": "Manufactured Site Specialties" } },
      "32 70": { title: "Wetlands", sub: { "32 70 00": "Wetlands", "32 71 00": "Constructed Wetlands", "32 72 00": "Wetlands Restoration" } },
      "32 80": { title: "Irrigation", sub: { "32 80 00": "Irrigation", "32 82 00": "Irrigation Pumps", "32 84 00": "Planting Irrigation", "32 86 00": "Agricultural Irrigation" } },
      "32 90": { title: "Planting", sub: { "32 90 00": "Planting", "32 91 00": "Planting Preparation", "32 92 00": "Turf and Grasses", "32 93 00": "Plants", "32 94 00": "Planting Accessories", "32 95 00": "Exterior Planting Support Structures", "32 96 00": "Transplanting" } }
    }
  },
  "33": {
    title: "Utilities",
    sections: {
      "33 00": { title: "General Utilities", sub: { "33 00 00": "Utilities", "33 01 00": "Operation and Maintenance", "33 05 00": "Common Work Results", "33 06 00": "Schedules", "33 08 00": "Commissioning", "33 09 00": "Instrumentation and Control" } },
      "33 10": { title: "Water Utilities", sub: { "33 10 00": "Water Utilities", "33 11 00": "Water Utility Distribution Piping", "33 12 00": "Water Utility Distribution Equipment", "33 13 00": "Disinfecting of Water Utility Distribution", "33 16 00": "Water Utility Storage Tanks" } },
      "33 20": { title: "Wells", sub: { "33 20 00": "Wells", "33 21 00": "Water Supply Wells", "33 22 00": "Test Wells", "33 23 00": "Extraction Wells", "33 24 00": "Monitoring Wells", "33 25 00": "Recharge Wells", "33 26 00": "Relief Wells", "33 29 00": "Well Abandonment" } },
      "33 30": { title: "Sanitary Sewerage Utilities", sub: { "33 30 00": "Sanitary Sewerage Utilities", "33 31 00": "Sanitary Utility Sewerage Piping", "33 32 00": "Wastewater Utility Pumping Stations", "33 33 00": "Low Pressure Utility Sewerage", "33 34 00": "Sanitary Utility Sewerage Force Mains", "33 36 00": "Utility Septic Tanks", "33 38 00": "Treatment Lagoons", "33 39 00": "Sanitary Utility Sewerage Structures" } },
      "33 40": { title: "Storm Drainage Utilities", sub: { "33 40 00": "Storm Drainage Utilities", "33 41 00": "Storm Utility Drainage Piping", "33 42 00": "Culverts", "33 44 00": "Storm Utility Water Drains", "33 45 00": "Storm Utility Drainage Pumps", "33 46 00": "Subdrainage", "33 47 00": "Ponds and Reservoirs", "33 49 00": "Storm Drainage Structures" } },
      "33 50": { title: "Fuel Distribution Utilities", sub: { "33 50 00": "Fuel Distribution Utilities", "33 51 00": "Natural-Gas Distribution", "33 52 00": "Liquid Fuel Distribution", "33 56 00": "Fuel-Storage Tanks" } },
      "33 60": { title: "Hydronic and Steam Energy Utilities", sub: { "33 60 00": "Hydronic and Steam Energy Utilities", "33 61 00": "Hydronic Energy Distribution", "33 63 00": "Steam Energy Distribution" } },
      "33 70": { title: "Electrical Utilities", sub: { "33 70 00": "Electrical Utilities", "33 71 00": "Electrical Utility Transmission and Distribution", "33 72 00": "Utility Substations", "33 73 00": "Utility Transformers", "33 75 00": "High-Voltage Switchgear and Protection Devices", "33 77 00": "Medium-Voltage Utility Switchgear and Protection Devices", "33 79 00": "Site Grounding" } },
      "33 80": { title: "Communications Utilities", sub: { "33 80 00": "Communications Utilities", "33 81 00": "Communications Structures", "33 82 00": "Communications Distribution", "33 83 00": "Wireless Communications Distribution" } }
    }
  },
  "34": {
    title: "Transportation",
    sections: {
      "34 00": { title: "General Transportation", sub: { "34 00 00": "Transportation", "34 01 00": "Operation and Maintenance", "34 05 00": "Common Work Results", "34 06 00": "Schedules", "34 08 00": "Commissioning" } },
      "34 10": { title: "Guideways/Railways", sub: { "34 10 00": "Guideways/Railways", "34 11 00": "Rail Tracks", "34 12 00": "Monorails", "34 13 00": "Funiculars", "34 14 00": "Cable Transportation" } },
      "34 20": { title: "Traction Power", sub: { "34 20 00": "Traction Power", "34 21 00": "Traction Power Distribution", "34 23 00": "Overhead Traction Power", "34 24 00": "Third Rail Traction Power" } },
      "34 40": { title: "Transportation Signaling and Control Equipment", sub: { "34 40 00": "Transportation Signaling and Control Equipment", "34 41 00": "Roadway Signaling and Control Equipment", "34 42 00": "Railway Signaling and Control Equipment", "34 43 00": "Airfield Signaling and Control Equipment", "34 48 00": "Bridge Signaling and Control Equipment" } },
      "34 50": { title: "Transportation Fare Collection Equipment", sub: { "34 50 00": "Transportation Fare Collection Equipment", "34 52 00": "Vehicle Fare Collection", "34 54 00": "Passenger Fare Collection" } },
      "34 70": { title: "Transportation Construction and Equipment", sub: { "34 70 00": "Transportation Construction and Equipment", "34 71 00": "Roadway Construction", "34 72 00": "Railway Construction", "34 73 00": "Airfield Construction", "34 75 00": "Roadway Equipment", "34 76 00": "Railway Equipment", "34 77 00": "Transportation Equipment" } },
      "34 80": { title: "Bridges", sub: { "34 80 00": "Bridges", "34 81 00": "Bridge Machinery", "34 82 00": "Bridge Specialties" } }
    }
  },
  "35": {
    title: "Waterway and Marine Construction",
    sections: {
      "35 00": { title: "General Waterway and Marine Construction", sub: { "35 00 00": "Waterway and Marine Construction", "35 01 00": "Operation and Maintenance", "35 05 00": "Common Work Results", "35 06 00": "Schedules", "35 08 00": "Commissioning" } },
      "35 10": { title: "Waterway/Marine Signaling", sub: { "35 10 00": "Waterway and Marine Signaling and Control Equipment", "35 11 00": "Signaling and Control Equipment for Waterways", "35 12 00": "Marine Signaling and Control Equipment", "35 13 00": "Signaling and Control Equipment for Dams" } },
      "35 20": { title: "Waterway/Marine Construction/Equipment", sub: { "35 20 00": "Waterway and Marine Construction and Equipment" } },
      "35 30": { title: "Coastal Construction", sub: { "35 30 00": "Coastal Construction", "35 31 00": "Shoreline Protection", "35 32 00": "Artificial Reefs" } },
      "35 40": { title: "Waterway Construction and Equipment", sub: { "35 40 00": "Waterway Construction and Equipment", "35 41 00": "Levees", "35 42 00": "Waterway Bank Protection", "35 43 00": "Waterway Scour Protection", "35 49 00": "Waterway Structures" } },
      "35 50": { title: "Marine Construction and Equipment", sub: { "35 50 00": "Marine Construction and Equipment", "35 51 00": "Floating Construction", "35 52 00": "Offshore Platform Construction", "35 53 00": "Underwater Construction", "35 59 00": "Marine Specialties" } },
      "35 70": { title: "Dam Construction and Equipment", sub: { "35 70 00": "Dam Construction and Equipment", "35 71 00": "Gravity Dams", "35 72 00": "Arch Dams", "35 73 00": "Embankment Dams", "35 74 00": "Buttress Dams", "35 79 00": "Auxiliary Dam Structures" } }
    }
  },
  "40": {
    title: "Process Integration",
    sections: {
      "40 00": { title: "General Process Integration", sub: { "40 00 00": "Process Integration", "40 01 00": "Operation and Maintenance", "40 05 00": "Common Work Results", "40 06 00": "Schedules", "40 80 00": "Commissioning" } },
      "40 10": { title: "Gas and Vapor Process Piping", sub: { "40 10 00": "Gas and Vapor Process Piping", "40 11 00": "Steam Process Piping", "40 12 00": "Compressed Air Process Piping", "40 13 00": "Inert Gases Process Piping", "40 14 00": "Fuel Gases Process Piping", "40 15 00": "Combustion System Gas Piping", "40 16 00": "Specialty and High-Purity Gases Piping", "40 17 00": "Welding and Cutting Gases Piping", "40 18 00": "Vacuum Systems Process Piping" } },
      "40 20": { title: "Liquids Process Piping", sub: { "40 20 00": "Liquids Process Piping", "40 21 00": "Liquid Fuel Process Piping", "40 22 00": "Petroleum Products Piping", "40 23 00": "Water Process Piping", "40 24 00": "Specialty Liquid Chemicals Piping", "40 25 00": "Liquid Acids and Bases Piping", "40 26 00": "Liquid Polymer Piping" } },
      "40 30": { title: "Solid and Mixed Materials Piping and Chutes", sub: { "40 30 00": "Solid and Mixed Materials Piping and Chutes", "40 32 00": "Bulk Materials Piping and Chutes", "40 33 00": "Bulk Materials Valves", "40 34 00": "Pneumatic Conveying Lines" } },
      "40 40": { title: "Process Piping and Equipment Protection", sub: { "40 40 00": "Process Piping and Equipment Protection", "40 41 00": "Process Piping and Equipment Heat Tracing", "40 42 00": "Process Piping and Equipment Insulation", "40 46 00": "Process Corrosion Protection", "40 47 00": "Refractories" } },
      "40 90": { title: "Instrumentation and Control", sub: { "40 90 00": "Instrumentation and Control for Process Systems", "40 91 00": "Primary Process Measurement Devices", "40 92 00": "Primary Control Devices", "40 93 00": "Analog Controllers/Recorders", "40 94 00": "Digital Process Controllers", "40 95 00": "Process Control Hardware", "40 96 00": "Process Control Software", "40 97 00": "Process Control Auxiliary Devices" } }
    }
  },
  "41": {
    title: "Material Processing and Handling Equipment",
    sections: {
      "41 00": { title: "General Material Processing", sub: { "41 00 00": "Material Processing and Handling Equipment", "41 01 00": "Operation and Maintenance", "41 06 00": "Schedules", "41 08 00": "Commissioning" } },
      "41 10": { title: "Bulk Material Processing Equipment", sub: { "41 10 00": "Bulk Material Processing Equipment", "41 11 00": "Bulk Material Sizing Equipment", "41 12 00": "Bulk Material Conveying Equipment", "41 13 00": "Bulk Material Feeders", "41 14 00": "Batching Equipment" } },
      "41 20": { title: "Piece Material Handling Equipment", sub: { "41 20 00": "Piece Material Handling Equipment", "41 21 00": "Conveyors", "41 22 00": "Cranes and Hoists", "41 23 00": "Lifting Devices", "41 24 00": "Specialty Material Handling Equipment" } },
      "41 30": { title: "Manufacturing Equipment", sub: { "41 30 00": "Manufacturing Equipment", "41 31 00": "Manufacturing Lines and Equipment", "41 32 00": "Forming Equipment", "41 33 00": "Machining Equipment", "41 34 00": "Finishing Equipment", "41 35 00": "Dies and Molds", "41 36 00": "Assembly and Testing Equipment" } },
      "41 40": { title: "Container Processing and Packaging", sub: { "41 40 00": "Container Processing and Packaging", "41 41 00": "Container Filling and Sealing", "41 42 00": "Container Packing Equipment", "41 43 00": "Shipping Packaging" } },
      "41 50": { title: "Material Storage", sub: { "41 50 00": "Material Storage", "41 51 00": "Automatic Material Storage", "41 52 00": "Bulk Material Storage", "41 53 00": "Storage Equipment and Systems" } },
      "41 60": { title: "Mobile Plant Equipment", sub: { "41 60 00": "Mobile Plant Equipment", "41 61 00": "Mobile Earth Moving Equipment", "41 62 00": "Trucks", "41 63 00": "General Vehicles", "41 64 00": "Rail Vehicles", "41 65 00": "Mobile Support Equipment", "41 66 00": "Miscellaneous Mobile Equipment", "41 67 00": "Plant Maintenance Equipment" } }
    }
  },
  "42": {
    title: "Process Heating, Cooling and Drying Equipment",
    sections: {
      "42 00": { title: "General Process Heating/Cooling/Drying", sub: { "42 00 00": "Process Heating, Cooling and Drying Equipment", "42 01 00": "Operation and Maintenance", "42 06 00": "Schedules", "42 08 00": "Commissioning" } },
      "42 10": { title: "Process Heating Equipment", sub: { "42 10 00": "Process Heating Equipment", "42 11 00": "Process Boilers", "42 12 00": "Process Heaters", "42 13 00": "Industrial Heat Exchangers and Recuperators", "42 14 00": "Industrial Furnaces", "42 15 00": "Industrial Ovens" } },
      "42 20": { title: "Process Cooling Equipment", sub: { "42 20 00": "Process Cooling Equipment", "42 21 00": "Process Cooling Towers", "42 22 00": "Process Chillers and Coolers", "42 23 00": "Process Condensers and Evaporators" } },
      "42 30": { title: "Process Drying Equipment", sub: { "42 30 00": "Process Drying Equipment", "42 31 00": "Gas Dryers and Dehumidifiers", "42 32 00": "Material Dryers" } }
    }
  },
  "43": {
    title: "Process Gas and Liquid Handling, Purification and Storage Equipment",
    sections: {
      "43 00": { title: "General Process Handling/Purification/Storage", sub: { "43 00 00": "Process Gas and Liquid Handling, Purification and Storage Equipment", "43 01 00": "Operation and Maintenance", "43 05 00": "Common Work Results", "43 06 00": "Schedules", "43 08 00": "Commissioning" } },
      "43 10": { title: "Gas Handling Equipment", sub: { "43 10 00": "Gas Handling Equipment", "43 11 00": "Gas Fans, Blowers, Pumps and Boosters", "43 12 00": "Gas Compressors", "43 13 00": "Gas Process Equipment", "43 15 00": "Process Air and Gas Filters" } },
      "43 20": { title: "Liquid Handling Equipment", sub: { "43 20 00": "Liquid Handling Equipment", "43 21 00": "Liquid Pumps", "43 22 00": "Liquid Process Equipment", "43 27 00": "Process Liquid Filters" } },
      "43 30": { title: "Gas and Liquid Purification Equipment", sub: { "43 30 00": "Gas and Liquid Purification Equipment", "43 31 00": "Gas and Liquid Purification Filtration Equipment", "43 32 00": "Gas and Liquid Purification Process Equipment" } },
      "43 40": { title: "Gas and Liquid Storage", sub: { "43 40 00": "Gas and Liquid Storage", "43 41 00": "Non-pressurized Tanks and Vessels", "43 42 00": "Pressurized Tanks and Vessels" } }
    }
  },
  "44": {
    title: "Pollution and Waste Control Equipment",
    sections: {
      "44 00": { title: "General Pollution and Waste Control", sub: { "44 00 00": "Pollution and Waste Control Equipment", "44 01 00": "Operation and Maintenance", "44 05 00": "Common Work Results", "44 06 00": "Schedules", "44 08 00": "Commissioning" } },
      "44 10": { title: "Air Pollution Control", sub: { "44 10 00": "Air Pollution Control", "44 11 00": "Particulate Control Equipment", "44 13 00": "Gaseous Air Pollution Control Equipment" } },
      "44 20": { title: "Noise Pollution Control", sub: { "44 20 00": "Noise Pollution Control", "44 21 00": "Noise Pollution Control Equipment" } },
      "44 30": { title: "Odor Control", sub: { "44 30 00": "Odor Control", "44 31 00": "Odor Treatment Equipment", "44 32 00": "Odor Dispersing and Masking/Counteracting Equipment" } },
      "44 40": { title: "Water Pollution Control Equipment", sub: { "44 40 00": "Water Pollution Control Equipment", "44 41 00": "Water Pollution Containment and Cleanup Equipment" } },
      "44 50": { title: "Solid Waste Control and Reuse", sub: { "44 50 00": "Solid Waste Control and Reuse", "44 51 00": "Solid Waste Collection, Transfer and Hauling Equipment", "44 53 00": "Solid Waste Processing Equipment", "44 55 00": "Composting Equipment" } },
      "44 60": { title: "Waste Thermal Processing Equipment", sub: { "44 60 00": "Waste Thermal Processing Equipment", "44 61 00": "Waste-to-Energy Plants", "44 62 00": "Fluidized Bed Combustion Equipment", "44 63 00": "Rotary Kiln Incinerators", "44 64 00": "Gasification Equipment", "44 65 00": "Pyrolysis Equipment", "44 66 00": "Hazardous Waste and Medical Waste Incinerators", "44 67 00": "Heat Recovery Equipment for Waste Thermal Processing", "44 68 00": "Synthesis Gas Cleanup and Handling Equipment" } }
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
    // 1. Static Header
    // Injecting Project Name and Location into the header rows
    let csvContent = `,"SPECIFICATION: ${projectInfo.name.toUpperCase()}\nSPACEX\n",,,,,\n`;
    csvContent += `,"SCOPE: ${projectInfo.location.toUpperCase()}                                BID FORMAT REV 0, PAGE: 1",,,,,\n`;
    csvContent += `,"BID FORMAT GUIDELINES:\nThis form must be submitted to form a complete bid package. \nAdditional documentation or itemized breakdowns may be submitted as an addendum. \nSend back the completed Bid Format in Excel format, DO NOT SAVE AS PDF \n",,,PLEASE INDICATE THAT YOU HAVE REVIEWED SPACEX STANDARD T&CS AND/OR SUPPLEMENTAL CONTRACT TEMPLATES PROVIDED IN THIS RFP,,\n`;
    csvContent += `,,,,,,\n`; // Empty row
    
    // Table Header - Matched to template exactly
    // Column B: Price Breakdown (Code + Title)
    // Column G: Notes (Qty + Unit + Ref + Description)
    csvContent += `,Price Breakdown,Labor Cost,Material Cost,Other Cost,Total,Notes\n`;

    // 2. Data Rows
    let totalProjectPrice = 0;

    bidItems.forEach((item) => {
        // Price Breakdown: Code - Title
        const priceBreakdown = `"${item.code} - ${item.title}"`;
        
        // Notes: Qty [Unit] | Ref: [Dwg] | [Description]
        const notes = `"Qty: ${item.quantity} ${item.unit} | Ref: ${item.dwgRef || 'N/A'} | ${item.description.replace(/"/g, '""')}"`;

        // Costs
        const l = parseFloat(item.labor) || 0;
        const m = parseFloat(item.material) || 0;
        const o = parseFloat(item.equipment) || 0;
        const q = parseFloat(item.quantity) || 0;

        // If engineer provides estimates, calculate line totals. Otherwise blank.
        const lineLabor = item.labor ? (l * q).toFixed(2) : '';
        const lineMaterial = item.material ? (m * q).toFixed(2) : '';
        const lineOther = item.equipment ? (o * q).toFixed(2) : '';
        
        // Calculate total only if components exist
        let lineTotal = '';
        if (lineLabor || lineMaterial || lineOther) {
             const sum = (parseFloat(lineLabor || 0) + parseFloat(lineMaterial || 0) + parseFloat(lineOther || 0));
             lineTotal = sum.toFixed(2);
             totalProjectPrice += sum;
        }

        // CSV Row: [Blank], Description, Labor, Material, Other, Total, Notes
        csvContent += `,${priceBreakdown},${lineLabor},${lineMaterial},${lineOther},${lineTotal},${notes}\n`;
    });

    // 3. Footer Section (Hardcoded from template)
    csvContent += `,,,,,,\n`; // Spacer
    csvContent += `,Total Price:,0,0,0,${totalProjectPrice.toFixed(2)},\n`; // Sum row
    csvContent += `,,,,,,\n`; // Spacer
    csvContent += `,Total Estimated Project Length (Working Days): ,21,,,,\n`;
    csvContent += `,Acceleration Costs,,,,,\n`;
    csvContent += `,Estimated Buy Down Acceleration Option (1 day) - COST,,,,,\n`;
    csvContent += `,Estimated Buy Down Acceleration Option (1 week)- COST,,,,,\n`;
    csvContent += `,,,,,,\n`;
    csvContent += `,Payment Terms,Net 120 Days - Spacex To review,,,,\n`;
    csvContent += `,"Mark Up (Materials , subcontracting and Travel)",0.1,,,,\n`;
    csvContent += `,Per Diem Per crew member,,,,,\n`;
    csvContent += `,,,,,,\n`;
    csvContent += `,Field Crew,Quantity,Notes,,,\n`;
    csvContent += `,Working Days per Week:,,,,,\n`;
    csvContent += `,Working Hours per Shift:,,,,,\n`;
    csvContent += `,# of Shifts per Day:,,,,,\n`;
    csvContent += `,Size of Crew Per Shift:,,,,,\n`;
    csvContent += `,Standby Charge ($ per hour per head):,,,,,\n`;
    csvContent += `,Total Hours Project,,,,,\n`;
    csvContent += `,,,,,,\n`;
    csvContent += `,Shop Crew,,Notes,,,\n`;
    csvContent += `,Working Days per Week:,,,,,\n`;

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
    e.target.value = '';
  };

  const processImportCSV = (csvText) => {
    try {
      const lines = csvText.split('\n');
      const newProjectInfo = { ...projectInfo };
      const newBidItems = [];

      // Parse Headers (Simple Check for SpaceX Format)
      lines.forEach((line, index) => {
          if(index === 0 && line.includes("SPECIFICATION:")) {
             const parts = line.split("SPECIFICATION:");
             if(parts[1]) newProjectInfo.name = parts[1].split("\n")[0].trim().replace(/"/g,'');
          }
          if(index === 1 && line.includes("SCOPE:")) {
             const parts = line.split("SCOPE:");
             if(parts[1]) newProjectInfo.location = parts[1].split("BID FORMAT")[0].trim().replace(/"/g,'');
          }
      });
      
      // Parse Data Rows
      let dataStartIndex = -1;
      for(let i=0; i<lines.length; i++) {
        if (lines[i].includes('Price Breakdown,Labor Cost')) {
          dataStartIndex = i + 1;
          break;
        }
      }

      if (dataStartIndex !== -1) {
        for (let i = dataStartIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line || line.startsWith(',Total Price:')) break; // Stop at footer

          // Splitting logic for quoted CSV
          const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          
          if (parts.length >= 7) {
            const clean = (str) => str ? str.replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            
            const priceBreakdown = clean(parts[1]);
            const code = priceBreakdown.split(' - ')[0] || '';
            const title = priceBreakdown.split(' - ').slice(1).join(' - ') || '';
            
            const notes = clean(parts[6]);
            // Attempt to parse back Notes string: "Qty: 100 LS | Ref: A-101 | Description"
            let qty = 0, unit = 'LS', ref = '', desc = '';
            
            const qtyMatch = notes.match(/Qty:\s*([\d.]+)\s*(\w+)/);
            if(qtyMatch) { qty = qtyMatch[1]; unit = qtyMatch[2]; }
            
            const refMatch = notes.match(/Ref:\s*([^|]+)/);
            if(refMatch) ref = refMatch[1].trim();

            const descMatch = notes.split('|');
            if(descMatch.length > 2) desc = descMatch.slice(2).join('|').trim();
            else desc = notes; // Fallback if format doesn't match

            newBidItems.push({
              id: Date.now() + i,
              code: code,
              title: title,
              dwgRef: ref === 'N/A' ? '' : ref,
              description: desc,
              quantity: parseFloat(qty) || 0,
              unit: unit,
              labor: parts[2] || '',
              material: parts[3] || '',
              equipment: parts[4] || '',
              division: '',
              section: ''
            });
          }
        }
      }

      setProjectInfo(newProjectInfo);
      setBidItems(newBidItems);
      alert(`Import Successful! Loaded ${newBidItems.length} items from template format.`);
    } catch (error) {
      console.error("Import Error:", error);
      alert("Error importing file.");
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
