<?php
declare(strict_types=1);

$root = dirname(__DIR__, 2);
$vendor = $root . '/.generators/streak';
require_once $vendor . '/vendor/autoload.php';
require_once $vendor . '/src/stats.php';
require_once $vendor . '/src/card.php';

$days = json_decode(file_get_contents($root . '/.build/calendar.json'), true, 512, JSON_THROW_ON_ERROR);
$counts = [];
foreach ($days as $day) {
    $counts[$day['date']] = $day['contributionCount'];
}
$stats = getContributionStats($counts);
foreach (['light' => 'default', 'dark' => 'github-dark-blue'] as $mode => $theme) {
    $svg = generateCard($stats, ['theme' => $theme, 'hide_border' => 'true', 'disable_animations' => 'true']);
    if (file_put_contents($root . '/.build/visuals/streak-' . $mode . '.svg', $svg) === false) {
        throw new RuntimeException('Could not write streak card');
    }
}
echo "Generated streak cards from the past-year UTC calendar\n";
