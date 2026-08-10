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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
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