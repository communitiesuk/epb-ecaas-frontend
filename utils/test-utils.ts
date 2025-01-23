function hyphenate(value: string | undefined) {
    if (value === undefined) {
      return '';
    }

    if (typeof value == 'string') {
      const formattedString = value.replaceAll(" ","-");

      return (
          formattedString.toLowerCase()
      );
    }

    return value;
  }

export default hyphenate