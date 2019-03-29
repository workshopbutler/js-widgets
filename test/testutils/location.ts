export function setLocation(href: string) {
  (global as any).window = {
    location: {
      href,
    },
  };
}

export function eraseLocation() {
  delete (global as any).window.location;
}
