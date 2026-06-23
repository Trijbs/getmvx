export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-[5%] py-10 text-center">
      <p className="text-[13px] text-[var(--muted)]">
        MVX by{" "}
        <a
          href="https://trijbsworld.nl"
          className="text-[var(--accent)] no-underline hover:underline"
        >
          trijbsworld.nl
        </a>{" "}
        · 2025
      </p>
    </footer>
  );
}
