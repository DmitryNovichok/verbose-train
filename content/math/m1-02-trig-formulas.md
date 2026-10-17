---
id: trig-formulas
title: Тригонометрические формулы
level: 1
module: Тригонометрия
hours: 5
prereq: trig-basics
summary: Формулы приведения, сложения, двойного угла, понижения степени и преобразования суммы в произведение — и как их не зубрить, а выводить.
---

## Как запоминать

Формул много, но почти все выводятся из двух: основного тождества $\sin^2\alpha+\cos^2\alpha=1$ и формул сложения. Выучите формулы сложения твёрдо — остальные получите из них за полминуты.

## Формулы сложения

:::thm Синус и косинус суммы
$$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta,$$
$$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta.$$
:::

Обратите внимание на знаки: у синуса знак тот же, у косинуса — противоположный. Тангенс суммы: $\tg(\alpha+\beta)=\dfrac{\tg\alpha+\tg\beta}{1-\tg\alpha\tg\beta}$.

:::example Вычислите $\sin75^\circ$.
$\sin(45^\circ+30^\circ)=\dfrac{\sqrt2}2\cdot\dfrac{\sqrt3}2+\dfrac{\sqrt2}2\cdot\dfrac12=\dfrac{\sqrt6+\sqrt2}{4}\approx0{,}966$.
:::

## Формулы приведения

Они сводят угол вида $\dfrac{\pi}{2}\pm\alpha$, $\pi\pm\alpha$, $\dfrac{3\pi}{2}\pm\alpha$, $2\pi\pm\alpha$ к углу $\alpha$. Вместо таблицы — правило из двух шагов:

:::algo Мнемоническое правило
1. **Меняется ли функция?** Если в формуле $\frac\pi2$ или $\frac{3\pi}2$ (вертикальная ось — «киваем головой вверх-вниз»: да), функция меняется на «кофункцию»: $\sin\leftrightarrow\cos$, $\tg\leftrightarrow\ctg$. Если $\pi$ или $2\pi$ (горизонтальная ось — «мотаем головой»: нет) — функция остаётся.
2. **Знак.** Считаем $\alpha$ маленьким острым углом, определяем четверть исходного угла и ставим знак **исходной** функции в этой четверти.
:::

Пример: $\cos\left(\dfrac{\pi}{2}+\alpha\right)$. Функция меняется на синус. Угол $\frac\pi2+\alpha$ во II четверти, косинус там отрицателен. Итог: $-\sin\alpha$.

Пример: $\tg(\pi-\alpha)$. Функция остаётся. II четверть, тангенс отрицателен: $-\tg\alpha$.

## Двойной угол

Из формул сложения при $\beta=\alpha$:

$$\sin2\alpha=2\sin\alpha\cos\alpha,$$
$$\cos2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha.$$

Три вида формулы косинуса двойного угла получаются заменой через основное тождество — выбирайте тот, что удобнее.

## Понижение степени

Из $\cos2\alpha=2\cos^2\alpha-1$ и $\cos2\alpha=1-2\sin^2\alpha$:
$$\cos^2\alpha=\frac{1+\cos2\alpha}{2},\qquad\sin^2\alpha=\frac{1-\cos2\alpha}{2}.$$

Эти формулы постоянно нужны в интегралах ($\int\sin^2x\,dx$), в физике (средняя мощность переменного тока) и в рядах Фурье.

## Сумма в произведение и обратно

$$\sin\alpha+\sin\beta=2\sin\frac{\alpha+\beta}2\cos\frac{\alpha-\beta}2,\qquad \cos\alpha+\cos\beta=2\cos\frac{\alpha+\beta}2\cos\frac{\alpha-\beta}2,$$
$$\cos\alpha-\cos\beta=-2\sin\frac{\alpha+\beta}2\sin\frac{\alpha-\beta}2.$$

Произведение в сумму:
$$\sin\alpha\cos\beta=\tfrac12\big[\sin(\alpha+\beta)+\sin(\alpha-\beta)\big],\qquad \cos\alpha\cos\beta=\tfrac12\big[\cos(\alpha-\beta)+\cos(\alpha+\beta)\big].$$

Физический смысл: сложение двух колебаний близких частот даёт **биения** — колебание с медленно меняющейся амплитудой.

[[plot sin(5x)+sin(5.6x); 2cos(0.3x) | -12 12 -2.5 2.5]]

## Вспомогательный угол

Выражение $a\sin x+b\cos x$ всегда сворачивается в одну синусоиду:
$$a\sin x+b\cos x=\sqrt{a^2+b^2}\,\sin(x+\varphi),\quad \cos\varphi=\frac{a}{\sqrt{a^2+b^2}},\ \sin\varphi=\frac{b}{\sqrt{a^2+b^2}}.$$
Отсюда, например, наибольшее значение $3\sin x+4\cos x$ равно $\sqrt{9+16}=5$.

:::formulas
- $\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$ — синус суммы
- $\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$ — косинус суммы
- $\sin2\alpha=2\sin\alpha\cos\alpha$ — синус двойного угла
- $\cos2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha$ — косинус двойного угла
- $\sin^2\alpha=\dfrac{1-\cos2\alpha}2,\ \cos^2\alpha=\dfrac{1+\cos2\alpha}2$ — понижение степени
- $\sin\alpha+\sin\beta=2\sin\frac{\alpha+\beta}2\cos\frac{\alpha-\beta}2$ — сумма синусов
- $a\sin x+b\cos x=\sqrt{a^2+b^2}\sin(x+\varphi)$ — вспомогательный угол
:::

@tasks

@task num 1
Вычислите $2\sin15^\circ\cos15^\circ$.
@answer 1/2
@solution
Это $\sin30^\circ=\frac12$.

@task num 1
Вычислите $\cos^2\dfrac{\pi}{8}-\sin^2\dfrac{\pi}{8}$. Ответ можно записать через `sqrt`.
@answer sqrt(2)/2
@solution
$\cos\frac{\pi}{4}=\frac{\sqrt2}{2}$.

@task num 2
Вычислите $\cos 75^\circ$. Ответ можно записать через `sqrt`.
@answer (sqrt(6)-sqrt(2))/4
@solution
$\cos(45^\circ+30^\circ)=\frac{\sqrt2}2\cdot\frac{\sqrt3}2-\frac{\sqrt2}2\cdot\frac12=\frac{\sqrt6-\sqrt2}4\approx0{,}259$.

@task choice 1
Чему равно $\sin\left(\dfrac{3\pi}{2}-\alpha\right)$?
@opt $\cos\alpha$
@opt* $-\cos\alpha$
@opt $\sin\alpha$
@opt $-\sin\alpha$
@solution
$\frac{3\pi}2$ — функция меняется на косинус. Угол в III четверти, синус там отрицателен: $-\cos\alpha$.

@task num 2
Найдите $\sin2\alpha$, если $\sin\alpha=0{,}6$ и $\alpha$ — острый угол.
@answer 0.96
@solution
$\cos\alpha=0{,}8$, $\sin2\alpha=2\cdot0{,}6\cdot0{,}8=0{,}96$.

@task num 2
Найдите $\cos2\alpha$, если $\sin\alpha=\dfrac13$.
@answer 7/9
@solution
$1-2\sin^2\alpha=1-\frac29=\frac79$.

@task num 2
Вычислите $\sin 105^\circ+\sin 15^\circ$. Ответ можно записать через `sqrt`.
@answer sqrt(6)/2
@solution
$2\sin60^\circ\cos45^\circ=2\cdot\frac{\sqrt3}2\cdot\frac{\sqrt2}2=\frac{\sqrt6}2$.

@task num 2
Найдите наибольшее значение выражения $5\sin x-12\cos x$.
@answer 13
@solution
$\sqrt{25+144}=13$.

@task num 3
Известно, что $\tg\alpha=2$. Найдите $\dfrac{\sin\alpha+3\cos\alpha}{2\sin\alpha-\cos\alpha}$.
@answer 5/3
@hint Разделите числитель и знаменатель на $\cos\alpha$.
@solution
$\dfrac{\tg\alpha+3}{2\tg\alpha-1}=\dfrac{5}{3}$.

@task num 3
Вычислите $\sin^4\dfrac{\pi}{8}+\cos^4\dfrac{\pi}{8}$.
@answer 3/4
@hint $\sin^4+\cos^4=(\sin^2+\cos^2)^2-2\sin^2\cos^2$.
@solution
$1-\frac12\sin^2\frac\pi4=1-\frac12\cdot\frac12=\frac34$.
