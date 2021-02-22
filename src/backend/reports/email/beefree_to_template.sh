#/bin/env bash

# This script is used to convert a HTML from trybee.io to a HTML Mustache
# template used in shootismoke. The idea is to search well-known strings in the
# Bee template, and convert them to corresponding Mustach {{}} placeholders.

# Replace images.
sed -i '' -e 's|http://www.marcelocoelho.cc/wp-content/uploads/2021/01/|https://shootismoke.app/email/|g' template.html

# Replace Mustache placeholders.
sed -i '' -e 's/Saint-Denis, France/{{closestCities.0.name}}/g' template.html
sed -i '' -e 's/3.5 cigarettes/{{closestCities.0.cigarettes}}/g' template.html
sed -i '' -e 's/Marseille, France/{{closestCities.1.name}}/g' template.html
sed -i '' -e 's/2.9 cigarettes/{{closestCities.1.cigarettes}}/g' template.html
sed -i '' -e 's/Bruxelles, Belgium/{{closestCities.2.name}}/g' template.html
sed -i '' -e 's/2.5 cigarettes/{{closestCities.2.cigarettes}}/g' template.html
sed -i '' -e 's/Lyon, France/{{closestCities.3.name}}/g' template.html
sed -i '' -e 's/1.8 cigarettes/{{closestCities.3.cigarettes}}/g' template.html
sed -i '' -e 's/Nantes, France/{{closestCities.4.name}}/g' template.html
sed -i '' -e 's/0.9 cigarettes/{{closestCities.4.cigarettes}}/g' template.html
sed -i '' -e 's/12.1/{{cigarettes}}/g' template.html
sed -i '' -e 's/every week/every {{frequencyPeriod}}/g' template.html
sed -i '' -e 's/Paris, Île de France, France/{{location}}/g' template.html
sed -i '' -e 's/Fine Particle (PM 2.5)*/{{pollutant}}/g' template.html
sed -i '' -e 's/Oh!/{{swearWord}}!/g' template.html
sed -i '' -e 's|Avoid jogging between <span style="color: #f2934e;">11am and 17pm</span> to avoid air pollution today.|{{{tips.0}}}|g' template.html
sed -i '' -e 's|<span style="color: #f2934e;">Enjoy </span><span style="">your usual physical activities.</span>|{{{tips.1}}}|g' template.html
sed -i '' -e 's|View privacy policy <a href="_blank"|View privacy policy <a href="https://github.com/amaurym/shoot-i-smoke/blob/master/docs/PRIVACY.md"|g' template.html
sed -i '' -e 's|Unsubscribe <a href="_blank"|Unsubscribe <a href="https://shootismoke.app/api/users/email/unsubscribe/{{userId}}"|g' template.html

# Manual steps to be done after:
# - Remove Made by Bee div
