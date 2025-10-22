describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    const validatePassword = (password: string): {
      valid: boolean;
      errors: string[];
    } => {
      const errors: string[] = [];

      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    };

    it('should validate strong passwords', () => {
      const result = validatePassword('StrongP@ss1');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password that is too short', () => {
      const result = validatePassword('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('lowercase1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('UPPERCASE1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePassword('NoNumber!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('NoSpecial1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const validateRequired = (value: string): boolean => {
        return value.trim().length > 0;
      };

      expect(validateRequired('value')).toBe(true);
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });

    it('should validate phone numbers', () => {
      const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^(\+63|0)?[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
      };

      expect(validatePhone('+639123456789')).toBe(true);
      expect(validatePhone('09123456789')).toBe(true);
      expect(validatePhone('9123456789')).toBe(true);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('invalid')).toBe(false);
    });
  });
});