const landingScreen = () => {
    const header = document.querySelector('#header');
    const app = document.querySelector('#app');

    header.innerHTML = `
<pre>
                           |\`-:_
  ,----....____            |    \`+.
 (             \`\`\`\`----....|___   |
  \\     _                      \`\`\`\`----....____
   \\    _)                                     \`\`\`---.._
    \\                                                   \\
  )\`.\\  )\`.   )\`.   )\`.   )\`.   )\`.   )\`.   )\`.   )\`.   )\`.
-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'

      __         ____            __               __      
     / / ___ _  / __/__ ____ _  / / ___ ____ ____/ / ___ _
    / /_/ _ \`/ / /__/ // /  ' \\/ _ / _ \`/ _ / __/ _ / _ \`/
   /____\\_,_/  \\___/\\_,_/_/_/_/_.__\\_,_/_//_\\__/_//_\\_,_/ 


  )\`.\\  )\`.   )\`.   )\`.   )\`.   )\`.   )\`.   )\`.   )\`.   )\`.
-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'   \`-'

</pre>
`;
    app.textContent = '> Haz clic o presiona cualquier tecla para iniciar';
};

export default landingScreen;
