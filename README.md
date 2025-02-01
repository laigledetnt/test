<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Launcher</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white">
    <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-4xl font-bold mb-6">Game Launcher</h1>
       
            <p class="text-lg mb-4">Choose a game to start playing:</p>
            <div class="space-y-4">
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('LG/Labyrinthe.html')">
                    Labyrinthe
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game2.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                 <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                 <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game2.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                 <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
                <button 
                    class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full" 
                    onclick="launchGame('game3.html')">
                    aucun
                </button>
            </div>
        </div>
        <footer class="mt-8 text-gray-500">
            <p>© 2025 Game Launcher Inc. All rights reserved.</p>
        </footer>
    </div>

    <script>
        function launchGame(gameUrl) {
            window.location.href = gameUrl;
        }
    </script>
</body>
</html>
