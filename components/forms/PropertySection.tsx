import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ErrorMessage} from '../common/ErrorMessage';

interface PropertySectionProps {
  values: {
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    postcode?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: {
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    postcode?: string;
  };
}

export const PropertySection = ({values, onChange, errors}: PropertySectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Property Details</h2>
        <p className="text-gray-600">Information about the property to be insured</p>
      </div>

      {/* Address Line 1 */}
      <div className="space-y-2">
        <Label htmlFor="addressLine1">
          Address Line 1
          <span className="text-red-600 ml-1" aria-label="required">*</span>
        </Label>
        <Input
          id="addressLine1"
          type="text"
          value={values.addressLine1 || ''}
          onChange={(e) => onChange('addressLine1', e.target.value)}
          placeholder="House number and street name"
          aria-invalid={!!errors.addressLine1}
          aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
        />
        {errors.addressLine1 && (
          <ErrorMessage message={errors.addressLine1}/>
        )}
      </div>

      {/* Address Line 2 (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input
          id="addressLine2"
          type="text"
          value={values.addressLine2 || ''}
          onChange={(e) => onChange('addressLine2', e.target.value)}
          placeholder="Apartment, suite, etc."
        />
      </div>

      {/* Address Line 3 (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="addressLine3">Address Line 3 (Optional)</Label>
        <Input
          id="addressLine3"
          type="text"
          value={values.addressLine3 || ''}
          onChange={(e) => onChange('addressLine3', e.target.value)}
          placeholder="Additional address details"
        />
      </div>

      {/* Postcode */}
      <div className="space-y-2">
        <Label htmlFor="postcode">
          Postcode
          <span className="text-red-600 ml-1" aria-label="required">*</span>
        </Label>
        <Input
          id="postcode"
          type="text"
          value={values.postcode || ''}
          onChange={(e) => {
            // Convert to uppercase as user types
            onChange('postcode', e.target.value.toUpperCase());
          }}
          placeholder="e.g., SW1A 1AA"
          maxLength={8}
          aria-invalid={!!errors.postcode}
          aria-describedby={errors.postcode ? 'postcode-error' : 'postcode-help'}
        />
        <p id="postcode-help" className="text-sm text-gray-500">
          UK postcode format (max 8 characters)
        </p>
        {errors.postcode && (
          <ErrorMessage message={errors.postcode}/>
        )}
      </div>
    </div>
  );
}