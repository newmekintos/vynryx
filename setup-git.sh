#!/bin/bash

echo "🔧 Git Yapılandırması"
echo ""
echo "GitHub kullanıcı adın nedir?"
read -p "Username: " username

echo ""
echo "GitHub email adresin nedir?"
read -p "Email: " email

git config --global user.name "$username"
git config --global user.email "$email"

echo ""
echo "✅ Git yapılandırıldı!"
echo "   Name: $(git config --global user.name)"
echo "   Email: $(git config --global user.email)"
