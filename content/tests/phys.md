---
subject: phys
title: Тест уровня по физике
---

@block basics
title: Единицы и движение
level: 0
start: units
covers: units, motion-basic
about: перевод единиц, скорость, средняя скорость

@task num 1
Переведите скорость 72 км/ч в метры в секунду.
@answer 20
@unit м/с
@solution
$72\cdot\frac{1000}{3600}=20$ м/с.

@task num 1
Автомобиль ехал 2,5 часа со скоростью 60 км/ч. Какой путь он проехал?
@answer 150
@unit км
@solution
$s=vt=60\cdot2{,}5=150$ км.

@task num 2
Велосипедист проехал 3 км за 10 минут, затем 2 км за 15 минут. Найдите его среднюю скорость.
@answer 12
@unit км/ч
@solution
Весь путь 5 км, всё время 25 мин $=\frac{5}{12}$ ч. $v=5:\frac5{12}=12$ км/ч.

@block forces
title: Силы, давление, работа
level: 0
start: mass-force
covers: mass-force, pressure, work-energy-basic
about: вес, давление жидкости, мощность

@task num 1
Найдите вес покоящегося тела массой 5 кг. Примите $g=10$ м/с².
@answer 50
@unit Н
@solution
$P=mg=50$ Н.

@task num 1
Найдите давление воды на глубине 2 м (без учёта атмосферного). Плотность воды 1000 кг/м³, $g=10$ м/с².
@answer 20000
@unit Па
@solution
$p=\rho gh=1000\cdot10\cdot2=20\,000$ Па.

@task num 2
Подъёмник поднимает груз массой 200 кг на высоту 5 м за 10 с. Найдите мощность ($g=10$ м/с²).
@answer 1000
@unit Вт
@solution
$N=\frac{mgh}{t}=\frac{200\cdot10\cdot5}{10}=1000$ Вт.

@block heat
title: Теплота и электрический ток
level: 0
start: heat-basic
covers: heat-basic, current-basic, light-basic
about: количество теплоты, закон Ома, соединения

@task num 1
Сколько теплоты нужно, чтобы нагреть 2 кг воды на 10 °C? Удельная теплоёмкость воды 4200 Дж/(кг·°C).
@answer 84000
@unit Дж
@solution
$Q=cm\Delta t=4200\cdot2\cdot10=84\,000$ Дж.

@task num 1
Напряжение на резисторе 12 В, сопротивление 4 Ом. Найдите силу тока.
@answer 3
@unit А
@solution
$I=\frac UR=3$ А.

@task num 2
Резисторы 6 Ом и 3 Ом соединены параллельно. Найдите общее сопротивление.
@answer 2
@unit Ом
@solution
$R=\frac{6\cdot3}{6+3}=2$ Ом.

@block kinematics
title: Кинематика
level: 1
start: kinematics
covers: kinematics
about: равноускоренное движение, бросок, движение по окружности

@task num 1
Тело падает без начальной скорости 2 с. Какую скорость оно приобретёт? $g=10$ м/с².
@answer 20
@unit м/с
@solution
$v=gt=20$ м/с.

@task num 2
Камень бросили горизонтально со скоростью 10 м/с с высоты 20 м. На каком расстоянии по горизонтали он упадёт? $g=10$ м/с².
@answer 20
@unit м
@solution
Время падения $t=\sqrt{2h/g}=2$ с, дальность $v_0t=20$ м.

@task num 2
Точка движется по окружности радиуса 5 м со скоростью 10 м/с. Найдите центростремительное ускорение.
@answer 20
@unit м/с²
@solution
$a=\frac{v^2}{R}=\frac{100}{5}=20$ м/с².

@block dynamics
title: Динамика и законы сохранения
level: 1
start: newton
covers: newton, momentum, energy, statics
about: законы Ньютона, импульс, энергия

@task num 1
На тело массой 2 кг действует сила 10 Н, трения нет. Найдите ускорение.
@answer 5
@unit м/с²
@solution
$a=\frac Fm=5$ м/с².

@task num 2
Шар массой 2 кг, летящий со скоростью 3 м/с, налетает на покоящийся шар массой 1 кг и слипается с ним. Найдите скорость шаров после удара.
@answer 2
@unit м/с
@solution
$m_1v_1=(m_1+m_2)u$, $u=\frac{6}{3}=2$ м/с.

@task num 2
Тело свободно падает с высоты 5 м. Найдите скорость у земли ($g=10$ м/с², сопротивления нет).
@answer 10
@unit м/с
@solution
$mgh=\frac{mv^2}2$, $v=\sqrt{2gh}=10$ м/с.

@block molecular
title: Колебания, газы, термодинамика
level: 1
start: oscillations-school
covers: oscillations-school, mkt, thermo-school
about: маятники, газовые законы, КПД

@task num 2
Найдите период колебаний груза массой 0,1 кг на пружине жёсткостью 40 Н/м.
@answer 2pi*sqrt(0.1/40)
@unit с
@solution
$T=2\pi\sqrt{m/k}=2\pi\cdot0{,}05\approx0{,}314$ с.

@task num 1
Газ сжали изотермически, увеличив давление в 3 раза. Каким стал объём, если сначала он был 6 л?
@answer 2
@unit л
@solution
$pV=\const$: $V=6/3=2$ л.

@task num 2
Найдите КПД цикла Карно с температурами нагревателя 500 К и холодильника 300 К. Ответ — в процентах.
@answer 40
@unit %
@solution
$\eta=1-\frac{300}{500}=0{,}4=40\%$.

@block electro
title: Электростатика и постоянный ток
level: 1
start: electrostatics-school
covers: electrostatics-school, dc-circuits
about: закон Кулона, конденсатор, закон Ома для полной цепи

@task num 1
Конденсатор ёмкостью 2 мкФ заряжен до напряжения 100 В. Найдите его заряд в микрокулонах.
@answer 200
@unit мкКл
@solution
$q=CU=2\cdot10^{-6}\cdot100=2\cdot10^{-4}$ Кл $=200$ мкКл.

@task num 2
Источник с ЭДС 12 В и внутренним сопротивлением 1 Ом подключён к резистору 5 Ом. Найдите силу тока.
@answer 2
@unit А
@solution
$I=\frac{\mathcal E}{R+r}=\frac{12}{6}=2$ А.

@task num 2
Два заряда по 1 мкКл находятся на расстоянии 0,3 м. С какой силой они взаимодействуют? $k=9\cdot10^9$ Н·м²/Кл².
@answer 0.1
@unit Н
@solution
$F=k\frac{q^2}{r^2}=9\cdot10^9\cdot\frac{10^{-12}}{0{,}09}=0{,}1$ Н.

@block magnetism
title: Магнетизм и индукция
level: 1
start: magnetism-school
covers: magnetism-school, induction-school, ac-em-osc
about: сила Ампера, ЭДС индукции, колебательный контур

@task num 1
Проводник длиной 0,2 м с током 4 А находится в магнитном поле 0,5 Тл перпендикулярно линиям поля. Найдите силу Ампера.
@answer 0.4
@unit Н
@solution
$F=BIL=0{,}5\cdot4\cdot0{,}2=0{,}4$ Н.

@task num 2
Магнитный поток через контур равномерно уменьшился на 0,6 Вб за 0,2 с. Найдите модуль ЭДС индукции.
@answer 3
@unit В
@solution
$|\mathcal E|=\frac{\Delta\Phi}{\Delta t}=3$ В.

@task num 2
Колебательный контур: $L=0{,}1$ Гн, $C=10$ мкФ. Найдите циклическую частоту собственных колебаний.
@answer 1000
@unit рад/с
@solution
$\omega=\frac{1}{\sqrt{LC}}=\frac1{\sqrt{10^{-6}}}=1000$ рад/с.

@block optics
title: Оптика и кванты
level: 1
start: optics-school
covers: optics-school, quantum-school
about: линзы, фотоны, радиоактивный распад

@task num 2
Предмет стоит на расстоянии 30 см от собирающей линзы с фокусным расстоянием 10 см. На каком расстоянии от линзы получится изображение?
@answer 15
@unit см
@solution
$\frac1f=\frac1F-\frac1d=\frac1{10}-\frac1{30}=\frac1{15}$, $f=15$ см.

@task num 2
Найдите энергию фотона с длиной волны 500 нм в электронвольтах. $hc\approx1240$ эВ·нм.
@answer 2.48
@unit эВ
@solution
$E=\frac{hc}\lambda=\frac{1240}{500}=2{,}48$ эВ.

@task num 1
Период полураспада изотопа 2 суток. Какая доля ядер останется через 6 суток? Ответ — дробью.
@answer 1/8
@solution
Три периода: $\left(\frac12\right)^3=\frac18$.

@block mech1
title: Механика 1 курса
level: 2
start: kinematics-vector
covers: kinematics-vector, dynamics, work-potential
about: векторная кинематика, работа силы, наклонная плоскость

@task num 2
Радиус-вектор точки $\vec r(t)=(2t^2;\,3t)$ (метры, секунды). Найдите модуль скорости при $t=1$ с.
@answer 5
@unit м/с
@solution
$\vec v=(4t;\,3)=(4;\,3)$, $|\vec v|=5$ м/с.

@task num 1
Постоянная сила $\vec F=(3;\,4)$ Н переместила тело на $\Delta\vec r=(2;\,1)$ м. Найдите работу.
@answer 10
@unit Дж
@solution
$A=\vec F\cdot\Delta\vec r=6+4=10$ Дж.

@task num 2
Брусок соскальзывает без трения с наклонной плоскости с углом $30^\circ$. Найдите ускорение ($g=9{,}8$ м/с²).
@answer 4.9
@unit м/с²
@solution
$a=g\sin30^\circ=4{,}9$ м/с².

@block rigid
title: Вращение и гравитация
level: 2
start: rigid-body
covers: rigid-body, angular-momentum, gravitation
about: момент инерции, энергия вращения, космические скорости

@task num 2
Найдите момент инерции тонкого стержня массой 3 кг и длиной 2 м относительно оси, проходящей через его конец перпендикулярно стержню.
@answer 4
@unit кг·м²
@solution
$I=\frac{ml^2}3=\frac{3\cdot4}{3}=4$ кг·м².

@task num 2
Сплошной диск массой 2 кг и радиусом 1 м вращается с угловой скоростью 10 рад/с. Найдите его кинетическую энергию.
@answer 50
@unit Дж
@solution
$I=\frac{mR^2}2=1$, $E=\frac{I\omega^2}2=50$ Дж.

@task num 2
На планете радиусом $4\cdot10^6$ м ускорение свободного падения у поверхности 4 м/с². Найдите первую космическую скорость.
@answer 4000
@unit м/с
@solution
$v=\sqrt{gR}=\sqrt{1{,}6\cdot10^7}=4000$ м/с.

@block oscill
title: Колебания, СТО, жидкости
level: 2
start: oscillations
covers: oscillations, waves-mech, relativity, fluids
about: затухание, лоренц-фактор, уравнение Бернулли

@task num 2
Амплитуда затухающих колебаний меняется как $A_0e^{-\beta t}$ с $\beta=0{,}5$ с⁻¹. Через сколько секунд амплитуда уменьшится в $e$ раз?
@answer 2
@unit с
@solution
$\beta t=1$, $t=2$ с.

@task num 2
Найдите лоренц-фактор $\gamma$ частицы, движущейся со скоростью $0{,}6c$.
@answer 1.25
@solution
$\gamma=\frac{1}{\sqrt{1-0{,}36}}=\frac1{0{,}8}=1{,}25$.

@task num 2
Вода вытекает из маленького отверстия в стенке бака на глубине 5 м под поверхностью. Найдите скорость струи ($g=10$ м/с²).
@answer 10
@unit м/с
@solution
Формула Торричелли: $v=\sqrt{2gh}=10$ м/с.

@block thermo
title: Молекулярная физика и термодинамика
level: 2
start: kinetic-theory
covers: kinetic-theory, thermodynamics, entropy, real-gases
about: распределение Максвелла, работа газа, энтропия

@task num 1
Во сколько раз увеличится среднеквадратичная скорость молекул газа, если абсолютную температуру увеличить в 4 раза?
@answer 2
@solution
$v_{\text{кв}}\propto\sqrt T$: в 2 раза.

@task num 1
Газ изобарно расширился при давлении $10^5$ Па, объём увеличился на 2 л. Найдите работу газа.
@answer 200
@unit Дж
@solution
$A=p\Delta V=10^5\cdot2\cdot10^{-3}=200$ Дж.

@task num 2
Один моль идеального газа изотермически расширился, объём увеличился в $e$ раз. Найдите изменение энтропии ($R=8{,}31$ Дж/(моль·К)).
@answer 8.31
@unit Дж/К
@solution
$\Delta S=\nu R\ln\frac{V_2}{V_1}=R=8{,}31$ Дж/К.

@block em1
title: Электростатика и цепи 2 курса
level: 3
start: gauss-law
covers: gauss-law, conductors-dielectrics, dc-advanced
about: теорема Гаусса, энергия поля, диэлектрики

@task num 2
Внутри замкнутой поверхности находится заряд $q=8{,}85\cdot10^{-12}$ Кл. Найдите поток вектора $\vec E$ через эту поверхность ($\varepsilon_0=8{,}85\cdot10^{-12}$ Ф/м).
@answer 1
@unit В·м
@solution
Теорема Гаусса: $\Phi=\frac{q}{\varepsilon_0}=1$ В·м.

@task num 1
Найдите энергию конденсатора ёмкостью 4 мкФ при напряжении 50 В.
@answer 0.005
@unit Дж
@solution
$W=\frac{CU^2}2=\frac{4\cdot10^{-6}\cdot2500}{2}=5\cdot10^{-3}$ Дж.

@task num 2
Плоский конденсатор подключён к источнику. Между пластинами вставили диэлектрик с $\varepsilon=3$, заполнив всё пространство. Во сколько раз изменится заряд конденсатора?
@answer 3
@solution
Напряжение держит источник, ёмкость выросла в 3 раза, значит, и заряд $q=CU$ вырос в 3 раза.

@block em2
title: Магнитное поле и переменный ток
level: 3
start: magnetostatics
covers: magnetostatics, magnetics, induction, ac-circuits
about: поле прямого тока, энергия катушки, импеданс

@task num 2
Найдите индукцию магнитного поля длинного прямого провода с током 10 А на расстоянии 0,1 м. Ответ — в микротеслах ($\mu_0=4\pi\cdot10^{-7}$ Гн/м).
@answer 20
@unit мкТл
@solution
$B=\frac{\mu_0I}{2\pi r}=\frac{4\pi\cdot10^{-7}\cdot10}{2\pi\cdot0{,}1}=2\cdot10^{-5}$ Тл $=20$ мкТл.

@task num 1
По катушке индуктивностью 0,2 Гн течёт ток 3 А. Найдите энергию магнитного поля катушки.
@answer 0.9
@unit Дж
@solution
$W=\frac{LI^2}2=\frac{0{,}2\cdot9}2=0{,}9$ Дж.

@task num 2
В цепи переменного тока последовательно включены резистор $R=3$ Ом и катушка с индуктивным сопротивлением $X_L=4$ Ом. Найдите модуль полного сопротивления.
@answer 5
@unit Ом
@solution
$Z=\sqrt{R^2+X_L^2}=5$ Ом.

@block waves
title: Уравнения Максвелла и волновая оптика
level: 3
start: maxwell
covers: maxwell, em-waves, interference, diffraction, polarization
about: уравнения Максвелла, опыт Юнга, закон Малюса

@task choice 2
Какое из уравнений Максвелла выражает отсутствие магнитных зарядов?
@opt $\rot\vec E=-\dfrac{\partial\vec B}{\partial t}$
@opt* $\Div\vec B=0$
@opt $\Div\vec D=\rho$
@opt $\rot\vec H=\vec j+\dfrac{\partial\vec D}{\partial t}$
@solution
Нулевая дивергенция означает, что линии $\vec B$ нигде не начинаются и не заканчиваются.

@task num 2
В опыте Юнга расстояние между щелями 0,5 мм, экран на расстоянии 1 м, длина волны 500 нм. Найдите ширину интерференционной полосы в миллиметрах.
@answer 1
@unit мм
@solution
$\Delta x=\frac{\lambda L}{d}=\frac{5\cdot10^{-7}\cdot1}{5\cdot10^{-4}}=10^{-3}$ м $=1$ мм.

@task num 2
Естественный свет проходит через поляризатор, затем через анализатор, повёрнутый на $60^\circ$ относительно поляризатора. Какая доля исходной интенсивности пройдёт через оба?
@answer 1/8
@solution
После поляризатора $I_0/2$, после анализатора $\frac{I_0}2\cos^260^\circ=\frac{I_0}8$.

@block quantum
title: Квантовая физика и атом
level: 4
start: thermal-radiation
covers: thermal-radiation, wave-particle, schrodinger, tunneling-oscillator, hydrogen
about: закон Вина, яма, атом водорода

@task num 2
Температура поверхности звезды 5800 К. Найдите длину волны максимума излучения в нанометрах (постоянная Вина $b=2{,}9\cdot10^{-3}$ м·К).
@answer 500
@unit нм
@solution
$\lambda_{\max}=\frac bT=\frac{2{,}9\cdot10^{-3}}{5800}=5\cdot10^{-7}$ м $=500$ нм.

@task num 2
Частица в бесконечно глубокой одномерной яме. Во сколько раз энергия второго уровня больше энергии первого?
@answer 4
@solution
$E_n\propto n^2$: $E_2/E_1=4$.

@task num 2
Энергия основного состояния атома водорода $-13{,}6$ эВ. Найдите энергию уровня $n=2$.
@answer -3.4
@unit эВ
@solution
$E_n=-\frac{13{,}6}{n^2}=-3{,}4$ эВ.

@block theory
title: Теоретическая механика, статфизика, ядро
level: 4
start: lagrange
covers: lagrange, hamilton, stat-phys, quantum-stats, solid-state, nuclear, particles
about: функция Лагранжа, распределение Больцмана, энергия связи

@task choice 2
Функция Лагранжа $L=\dfrac{m\dot x^2}{2}-\dfrac{kx^2}{2}$. Какое уравнение движения из неё следует?
@opt* $m\ddot x=-kx$
@opt $m\ddot x=kx$
@opt $m\dot x=-kx$
@opt $m\ddot x=-kx^2/2$
@solution
$\frac{d}{dt}\frac{\partial L}{\partial\dot x}=\frac{\partial L}{\partial x}$: $m\ddot x=-kx$.

@task num 2
Дефект массы ядра равен 0,1 а.е.м. Найдите энергию связи в МэВ (1 а.е.м. соответствует 931,5 МэВ).
@answer 93.15
@unit МэВ
@solution
$0{,}1\cdot931{,}5=93{,}15$ МэВ.

@task num 2
Два невырожденных уровня отличаются по энергии на $\Delta E=kT\ln2$. Найдите отношение заселённости верхнего уровня к нижнему.
@answer 1/2
@solution
$\frac{n_2}{n_1}=e^{-\Delta E/kT}=e^{-\ln2}=\frac12$.

@block special
title: Специальные главы
level: 5
start: qm-formalism
covers:
about: коммутаторы, число Рейнольдса, излучение

@task choice 3
Чему равен коммутатор $[\hat x,\hat p_x]$?
@opt $0$
@opt* $i\hbar$
@opt $-i\hbar\,\hat x$
@opt $\hbar$
@solution
Каноническое коммутационное соотношение: $[\hat x,\hat p_x]=i\hbar$.

@task num 3
Вода (кинематическая вязкость $10^{-6}$ м²/с) течёт со скоростью 1 м/с в трубе диаметром 1 см. Найдите число Рейнольдса.
@answer 10000
@solution
$Re=\frac{vd}{\nu}=\frac{1\cdot0{,}01}{10^{-6}}=10^4$ — течение турбулентное.

@task num 3
Во сколько раз увеличится мощность излучения колеблющегося диполя, если частоту колебаний увеличить вдвое при той же амплитуде дипольного момента?
@answer 16
@solution
$P\propto\omega^4$: в $2^4=16$ раз.
