import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsStrongPass(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isStrongPass',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const strongPasswordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{10,}$/;
          return typeof value === 'string' && strongPasswordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least 10 characters long, containing upper and lower case letters, numbers and special characters.`;
        },
      },
    });
  };
}
