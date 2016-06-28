import { startAnimation } from './animation';


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startAnimation);
} else {
  startAnimation();
}