import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '../common/ErrorMessage';

interface PolicyholderSectionProps {
  values: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  };
}

export const PolicyholderSection = ({ values, onChange, errors }: PolicyholderSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Policyholder Information</h2>
        <p className="text-gray-600">Please provide your personal details</p>
      </div>

      {/* First Name */}
      <div className="space-y-2">
        <Label htmlFor="firstName">
          First Name
          <span className="text-red-600 ml-1" aria-label="required">*</span>
        </Label>
        <Input
          id="firstName"
          type="text"
          value={values.firstName || ''}
          onChange={(e) => onChange('firstName', e.target.value)}
          placeholder="Enter your first name"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
        />
        {errors.firstName && (
          <ErrorMessage message={errors.firstName}/>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <Label htmlFor="lastName">
          Last Name
          <span className="text-red-600 ml-1" aria-label="required">*</span>
        </Label>
        <Input
          id="lastName"
          type="text"
          value={values.lastName || ''}
          onChange={(e) => onChange('lastName', e.target.value)}
          placeholder="Enter your last name"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
        />
        {errors.lastName && (
          <ErrorMessage message={errors.lastName} />
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">
          Date of Birth
          <span className="text-red-600 ml-1" aria-label="required">*</span>
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={values.dateOfBirth || ''}
          onChange={(e) => onChange('dateOfBirth', e.target.value)}
          max={new Date().toISOString().split('T')[0]} // Cannot be in the future
          aria-invalid={!!errors.dateOfBirth}
          aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : 'dateOfBirth-help'}
        />
        <p id="dateOfBirth-help" className="text-sm text-gray-500">
          You must be 18 or over to purchase insurance
        </p>
        {errors.dateOfBirth && (
          <ErrorMessage message={errors.dateOfBirth} />
        )}
      </div>
    </div>
  );
}