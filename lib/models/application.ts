import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  companyName: String,
  managerPhone: {
    type: String,
    validate: {
      validator: (v: string) => /^[0-9]{11}$/.test(v),
      message: 'Phone number must be 11 digits'
    }
  },
  startDate: Date,
  endDate: Date,
  reasonForLeaving: String,
  averageSales: {
    type: Number,
    max: 1000000
  }
});

const applicationSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: true,
    minlength: 3
  },
  nationalId: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[0-9]{14}$/.test(v),
      message: 'National ID must be 14 digits'
    }
  },
  
  // Job Information
  selectedJob: {
    type: String,
    required: true,
    enum: ['pharmacist', 'assistant', 'accountant', 'financial']
  },

  // Documents
  nationalIdFront: {
    type: String, // Cloudinary URL
    required: true
  },
  nationalIdBack: {
    type: String, // Cloudinary URL
    required: true
  },
  educationLevel: {
    type: String,
    required: true,
    enum: ['none', 'diploma', 'bachelor', 'master', 'phd']
  },
  educationCertificate: {
    type: String, // Cloudinary URL
    required: function(this: any) {
      return this.educationLevel !== 'none';
    }
  },
  cv: {
    type: String, // Cloudinary URL
    required: true
  },

  // Pharmacist Specific Documents
  pharmacistLicense: {
    type: String, // Cloudinary URL
    required: function(this: any) {
      return this.selectedJob === 'pharmacist';
    }
  },
  syndicateCard: {
    type: String, // Cloudinary URL
    required: function(this: any) {
      return this.selectedJob === 'pharmacist';
    }
  },

  // Contact Information
  address: {
    type: String,
    required: true,
    minlength: 5
  },
  transportation: {
    type: String,
    required: true,
    enum: ['car', 'motorcycle', 'bicycle', 'public', 'none']
  },

  // Experience
  experiences: [experienceSchema],

  // Application Status
  status: {
    type: String,
    required: true,
    enum: ['under_review', 'needs_revision', 'accepted', 'rejected'],
    default: 'under_review'
  },

  // Scoring
  autoScore: {
    type: Number,
    default: 0
  },
  manualScore: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },

  // Admin Notes
  adminNotes: String,

  // Timestamps for all status changes
  statusHistory: [{
    status: {
      type: String,
      enum: ['under_review', 'needs_revision', 'accepted', 'rejected']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Pre-save middleware to validate dates
applicationSchema.pre('save', function(next) {
  // Validate experience dates
  if (this.experiences) {
    for (const exp of this.experiences) {
      if (exp.endDate && exp.startDate && exp.endDate < exp.startDate) {
        next(new Error('End date cannot be before start date'));
        return;
      }
    }
  }

  // Calculate total score
  this.totalScore = (this.autoScore || 0) + (this.manualScore || 0);

  next();
});

// Add status change method
applicationSchema.methods.changeStatus = function(newStatus: string, note?: string) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note
  });
};

// Calculate auto score based on criteria
applicationSchema.methods.calculateAutoScore = function() {
  let score = 0;

  // Education score
  switch (this.educationLevel) {
    case 'phd': score += 30; break;
    case 'master': score += 25; break;
    case 'bachelor': score += 20; break;
    case 'diploma': score += 15; break;
  }

  // Experience score
  if (this.experiences && this.experiences.length > 0) {
    score += Math.min(this.experiences.length * 5, 20); // Max 20 points for experience
  }

  // Required documents score
  if (this.selectedJob === 'pharmacist') {
    if (this.pharmacistLicense && this.syndicateCard) {
      score += 20;
    }
  }

  this.autoScore = score;
  this.totalScore = this.autoScore + (this.manualScore || 0);
};

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export type ApplicationDocument = mongoose.Document & {
  fullName: string;
  nationalId: string;
  selectedJob: string;
  // ... other fields
  changeStatus: (newStatus: string, note?: string) => void;
  calculateAutoScore: () => void;
}; 