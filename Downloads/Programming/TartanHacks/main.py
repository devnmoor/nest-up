import sys
import pygame

# ----------------------------
# Config / Constants
# ----------------------------
W, H = 900, 900
FPS = 60

BG_COLOR = (30, 30, 30)
TEXT_COLOR = (0, 0, 0)

FLASH_RADIUS = 50
SOFT_EDGE = 60          # bigger = softer falloff
SMOOTHING = 0.15        # 0.08 = smoother/slower, 0.25 = snappier


# ----------------------------
# Helpers
# ----------------------------
def create_world(size: tuple[int, int]) -> pygame.Surface:
    """Create and pre-render the static world surface."""
    world = pygame.Surface(size)
    world.fill(BG_COLOR)
    pygame.draw.rect(world, (200, 60, 60), (80, 120, 240, 140))
    pygame.draw.circle(world, (60, 180, 220), (650, 220), 90)
    pygame.draw.rect(world, (80, 220, 120), (520, 380, 320, 140))


    font = pygame.font.SysFont(None, 48)
    text = font.render("Find the clue!", True, TEXT_COLOR)
    world.blit(text, (320, 40))

    return world


def draw_flashlight_mask(mask: pygame.Surface, pos: tuple[int, int]) -> None:
    """Draw a black overlay with a transparent/soft hole where the flashlight is."""
    mask.fill((0, 0, 0, 255))  # fully dark

    x, y = pos

    # Center: fully visible
    pygame.draw.circle(mask, (0, 0, 0, 0), (x, y), FLASH_RADIUS)

    # Falloff ring: gets darker as it moves outward
    for i in range(SOFT_EDGE):
        r = FLASH_RADIUS + i
        alpha = int(255 * (i / SOFT_EDGE))
        pygame.draw.circle(mask, (0, 0, 0, alpha), (x, y), r, width=1)


def smooth_follow(current: float, target: float, smoothing: float) -> float:
    """Exponential smoothing toward target."""
    return current + (target - current) * smoothing


def handle_events() -> None:
    """Process events; quit cleanly."""
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()


# ----------------------------
# Main loop
# ----------------------------
def main() -> None:
    pygame.init()

    screen = pygame.display.set_mode((W, H))
    pygame.display.set_caption("Flashlight Demo")
    clock = pygame.time.Clock()

    world = create_world((W, H))

    # Overlay (per-pixel alpha)
    darkness = pygame.Surface((W, H), flags=pygame.SRCALPHA)

    # Smooth mouse variables
    flash_x, flash_y = W // 2, H // 2

    while True:
        handle_events()

        mx, my = pygame.mouse.get_pos()
        flash_x = smooth_follow(flash_x, mx, SMOOTHING)
        flash_y = smooth_follow(flash_y, my, SMOOTHING)
        flash_pos = (int(flash_x), int(flash_y))

        # Draw world + overlay
        screen.blit(world, (0, 0))
        draw_flashlight_mask(darkness, flash_pos)
        screen.blit(darkness, (0, 0))
        
        pygame.display.flip()
        clock.tick(FPS)


if __name__ == "__main__":
    main()
