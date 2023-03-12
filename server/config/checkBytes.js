exports.bytesToMegaBytes = (bytes) => {
    const megaBytes = bytes / (1024 * 1024);
    if (megaBytes < 1) {
      const kiloBytes = bytes / 1024;
      return kiloBytes.toFixed(2) + " KB";
    } else {
      return megaBytes.toFixed(2) + " MB";
    }
  };