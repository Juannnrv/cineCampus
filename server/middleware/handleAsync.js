
exports.handleAsync = async (fn) => {
    try {
      const result = await fn();
      return { result, error: null };
    } catch (error) {
      return { result: null, error };  
    }
  };    