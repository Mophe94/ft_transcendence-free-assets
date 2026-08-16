import RegularBG from '../background/RegularBg';
import ImgFrame from '../components/ImgFrame';

import dylan from '../assets/others/dylan.png';
import Heading from '../components/heading/Heading';

export default function AboutUs() {
  return (
    <RegularBG>
      <Heading text="The Team" size="l"/>
      <div
        id="Dylan"
        className="
          grid justify-items-center mt-[clamp(1rem,3vw,3rem)] mb-[clamp(1rem,6vw,3rem)]
          md:grid-cols-[1fr_3fr] md:my-12
          lg:grid-rows-[auto_1fr]
        "
      >
        <div
          className="
            font-rocker text-black text-[clamp(0.8rem,8vw,4rem)]
            md:col-start-2 md:col-span-1 md:row-start-1 md:content-center
            lg:w-full lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:text-[clamp(0.8rem,8vw,2rem)] lg:pt-4 lg:pr-24 lg:content-start lg:text-end
          "
        >
          <div>Dbajeux</div>
        </div>
        <div
          className="
            w-[min(300px,25vw)] mb-4
            md:col-start-1 md:col-span-1 md:row-start-1
            lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2
          "
        >
          <ImgFrame imgSrc={dylan} imgAlt="picture Dylan" color="black" />
        </div>
        <div
          className="
            md:col-start-1 md:col-span-2 md:row-start-2
            lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:p-12 lg:pb-0 lg:h-auto
          "
        >
          <div className="text-justify">
            I started programming after a career as a chef, a job I loved but that, over time, became too hard on my body. I needed to find balance again, and working with my head rather than my gut became an obvious choice.
This project was a real personal challenge: after a burnout, relearning how to pace your energy at work doesn't come naturally. But surrounded by a motivated and supportive team, we pushed the subject to its limit, challenging ourselves to deliver far more than just a graduation project a genuine application designed like a professional product.
What I'm proudest of is exactly that: not settling for a minimum viable product, but reaching for real quality, together.
          </div>
        </div>
      </div>

      <div
        id="Aurore"
        className="
          grid justify-items-center mt-[clamp(1rem,3vw,3rem)] mb-[clamp(1rem,6vw,3rem)]
          md:grid-cols-[3fr_1fr] md:my-12
          lg:grid-rows-[auto_1fr]
        "
      >
        <div
          className="
            font-rocker text-black text-[clamp(0.8rem,8vw,4rem)]
            md:col-start-1 md:col-span-1 md:row-start-1 md:content-center
            lg:w-full lg:col-start-1 lg:col-span-1 lg:row-start-2 lg:text-[clamp(0.8rem,8vw,2rem)] lg:pt-4 lg:pl-24 lg:content-start
          "
        >
          <div>Agaland</div>
        </div>
        <div
          className="
            w-[min(300px,25vw)] mb-4
            md:col-start-2 md:col-span-1 md:row-start-1
            lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:row-span-2
          "
        >
          <ImgFrame
            imgSrc="https://cdn.intra.42.fr/users/4a2a9f9dce90eeef627c357ee393a346/agaland.jpg"
            imgAlt="picture Aurore"
            color="blue"
          />
        </div>
        <div
          className="
            md:col-start-1 md:col-span-2 md:row-start-2
            lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:p-12 lg:pb-0 lg:h-auto
          "
        >
          <div className="text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
          </div>
        </div>
      </div>

      <div
        id="Bertrand"
        className="
          grid justify-items-center mt-[clamp(1rem,3vw,3rem)] mb-[clamp(1rem,6vw,3rem)]
          md:grid-cols-[1fr_3fr] md:my-12
          lg:grid-rows-[auto_1fr]
        "
      >
        <div
          className="
            font-rocker text-black text-[clamp(0.8rem,8vw,4rem)]
            md:col-start-2 md:col-span-1 md:row-start-1 md:content-center
            lg:w-full lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:text-[clamp(0.8rem,8vw,2rem)] lg:pt-4 lg:pr-24 lg:content-start lg:text-end
          "
        >
          <div>Bertrmar</div>
        </div>
        <div
          className="
            w-[min(300px,25vw)] mb-4
            md:col-start-1 md:col-span-1 md:row-start-1
            lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2
          "
        >
          <ImgFrame
            imgSrc="https://cdn.intra.42.fr/users/c10b1c69a639cdd5414f6f163518be60/bertrmar.jpg"
            imgAlt="picture Bertrand"
            color="toxic"
          />
        </div>
        <div
          className="
            md:col-start-1 md:col-span-2 md:row-start-2
            lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:p-12 lg:pb-0 lg:h-auto
          "
        >
          <div className="text-justify">
            <b>en</b><br/><br/>

I got into programming in 2025 after a career path that was as varied as it was unpredictable, followed by a forced break that turned out to be beneficial. As a huge fan of video games and geek culture in general, this career change was a natural extension of my interests.

When we launched this project, we had only two rules: if we already knew how to use a technology, we wouldn’t use it, and we weren’t allowed to buy asset packs. Needless to say, we had a lot of fun!

I’m very proud of the final result: it really looks like the kind of game I’d love to spend my free time playing. The fact that we designed a scalable architecture is a real plus—which means, in a way, that the adventure will never end.

<br/><br/><b>fr</b><br/><br/>

Je me suis lancé dans la programmation en 2025 après un parcours professionnel aussi varié qu’imprévisible, suivi d’une pause forcée qui s’est avérée salutaire. Grand passionné de jeux vidéo et de la culture geek en général, cette reconversion était le prolongement naturel de mes centres d’intérêt.

En lançant ce projet, nous n’avions que deux consignes : si on maîtrise déjà une technologie, on ne l’utilise pas, et interdiction d’acheter des packs d’assets. Autant dire qu’on a bien rigolé!

Je suis très fier du résultat final : il ressemble vraiment au genre de jeu sur lequel j’aimerais passer mon temps libre. Le fait d’avoir conçu une architecture scalable est un vrai plus, ce qui signifie, en quelque sorte, que l’aventure n’aura jamais de fin.
          </div>
        </div>
      </div>
      <div
        id="Kevin"
        className="
          grid justify-items-center mt-[clamp(1rem,3vw,3rem)] mb-[clamp(1rem,6vw,3rem)]
          md:grid-cols-[3fr_1fr] md:my-12
          lg:grid-rows-[auto_1fr]
        "
      >
        <div
          className="
            font-rocker text-black text-[clamp(0.8rem,8vw,4rem)]
            md:col-start-1 md:col-span-1 md:row-start-1 md:content-center
            lg:w-full lg:col-start-1 lg:col-span-1 lg:row-start-2 lg:text-[clamp(0.8rem,8vw,2rem)] lg:pt-4 lg:pl-24 lg:content-start
          "
        >
          <div>Kprist</div>
        </div>
        <div
          className="
            w-[min(300px,25vw)] mb-4
            md:col-start-2 md:col-span-1 md:row-start-1
            lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:row-span-2
          "
        >
          <ImgFrame
            imgSrc="https://hips.hearstapps.com/hmg-prod/images/gettyimages-2150933231-6641f39e54c8d.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1120:*"
            imgAlt="picture Kevin"
            color="red"
          />
        </div>
        <div
          className="
            md:col-start-1 md:col-span-2 md:row-start-2
            lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:p-12 lg:pb-0 lg:h-auto
          "
        >
          <div className="text-justify">
            As a versatile teammate bridging the gap between front and back, I juggle database architecture, API integrations, and the messiest merge conflicts. With a knack for breaking down even the most baffling bugs, I always keep a clear bird’s-eye view of the project's big picture. Always ready for a peer-programming session or a quick emergency unblock, I like to think of myself as the engine keeping the machine running smoothly from day one to the final push.
          </div>
        </div>
      </div>

      {/* Simon - Section Left */}
      <div
        id="Simon"
        className="
          grid justify-items-center mt-[clamp(1rem,3vw,3rem)] mb-[clamp(1rem,6vw,3rem)]
          md:grid-cols-[1fr_3fr] md:my-12
          lg:grid-rows-[auto_1fr]
        "
      >
        <div
          className="
            font-rocker text-black text-[clamp(0.8rem,8vw,4rem)]
            md:col-start-2 md:col-span-1 md:row-start-1 md:content-center
            lg:w-full lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:text-[clamp(0.8rem,8vw,2rem)] lg:pt-4 lg:pr-24 lg:content-start lg:text-end
          "
        >
          <div>Stempels</div>
        </div>
        <div
          className="
            w-[min(300px,25vw)] mb-4
            md:col-start-1 md:col-span-1 md:row-start-1
            lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2
          "
        >
          <ImgFrame
            imgSrc="https://cdn.intra.42.fr/users/631cec4de555931d34960f24f1b8bfc9/stempels.jpg"
            imgAlt="picture Dylan"
            color="yellow"
          />
        </div>
        <div
          className="
            md:col-start-1 md:col-span-2 md:row-start-2
            lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:p-12 lg:pb-0 lg:h-auto
          "
        >
          <div className="text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
          </div>
        </div>
      </div>
    </RegularBG>
  );
}